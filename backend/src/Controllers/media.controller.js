import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { Media } from "../models/media.model.js";
import { MediaLike } from "../models/mediaLike.model.js";
import { MediaComment } from "../models/mediaComment.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { cleanupLocalFiles } from "../utils/fileCleanUp.js";
import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import { deleteFromCloudinary } from "../utils/cloudinary.js";


export const createMediaPost = asyncHandler(async (req, res) => {
    const { description } = req.body;
    const userId = req.user._id;

    const files = req.files || {};
    let images = [];
    let video = null;

    // Check both media types together
    if (files.video && files.images) {
      cleanupLocalFiles(files);
      throw new ApiError(400, "You can upload either a video or images, not both.");
    }

    // Ensure at least one media file exists
    if (!files.video && !files.images) {
      throw new ApiError(400, "You must upload at least one image or one video.");
    }

    // Handle video upload
    if (files.video) {
      if (files.video.length > 1) {
        cleanupLocalFiles(files);
        throw new ApiError(400, "Only one video is allowed per post.");
      }

      const uploadedVideo = await uploadOnCloudinary(files.video[0].path);
      if (!uploadedVideo?.url) {
        cleanupLocalFiles(files);
        throw new ApiError(500, "Video upload failed");
      }

      video = uploadedVideo.url;
    }

    // Handle image uploads
    if (files.images) {
      if (files.images.length > 3) {
        cleanupLocalFiles(files);
        throw new ApiError(400, "You can upload a maximum of 3 images.");
      }

      for (const img of files.images) {
        const uploadedImage = await uploadOnCloudinary(img.path);
        if (uploadedImage?.url) images.push(uploadedImage.url);
      }

      if (images.length === 0) {
        cleanupLocalFiles(files);
        throw new ApiError(400, "At least one image is required.");
      }
    }

    const media = await Media.create({
      user: userId,
      description,
      images,
      video,
    });
    cleanupLocalFiles(files);
    return res
      .status(201)
      .json(new ApiResponse(201, media, "Media post created successfully"));
});

export const toggleLikeMedia = asyncHandler(async (req, res) => {
  const { mediaId } = req.params;
  const userId = req.user._id;

  // Validate media ID
  if (!mongoose.Types.ObjectId.isValid(mediaId)) {
    throw new ApiError(400, "Invalid media ID");
  }

  const existingLike = await MediaLike.findOne({ media: mediaId, user: userId });

  if (existingLike) {
    //  Remove like
    await MediaLike.deleteOne({ _id: existingLike._id });

    // Recalculate updated likes count using aggregation
    const [updatedPost] = await Media.aggregate([
      { $match: { _id: new ObjectId(mediaId) } },
      {
        $lookup: {
          from: "medialikes",
          localField: "_id",
          foreignField: "media",
          as: "likes",
        },
      },
      { $addFields: { likes_count: { $size: "$likes" } } },
      { $project: { description: 1, images: 1, video: 1, likes_count: 1 } },
    ]);

    // Update the likes_count in the media collection for consistency
    await Media.findByIdAndUpdate(mediaId, {
      likes_count: updatedPost?.likes_count || 0,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedPost, "Media unliked successfully")
      );
  }

  // Add like
  await MediaLike.create({ media: mediaId, user: userId });

  const [updatedPost] = await Media.aggregate([
    { $match: { _id: new ObjectId(mediaId) } },
    {
      $lookup: {
        from: "medialikes",
        localField: "_id",
        foreignField: "media",
        as: "likes",
      },
    },
    { $addFields: { likes_count: { $size: "$likes" } } },
    { $project: { description: 1, images: 1, video: 1, likes_count: 1 } },
  ]);

  // Sync media document’s likes_count field
  await Media.findByIdAndUpdate(mediaId, {
    likes_count: updatedPost?.likes_count || 0,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Media liked successfully"));
});

export const addComment = asyncHandler(async (req, res) => {
  const { mediaId } = req.params;
  const { comment_text } = req.body;
  const userId = req.user._id;

  if (!comment_text?.trim()) {
    throw new ApiError(400, "Comment text is required");
  }

  // Check if media exists
  const media = await Media.findById(mediaId);
  if (!media) throw new ApiError(404, "Media post not found");

  // Create comment
  const comment = await MediaComment.create({
    media: mediaId,
    user: userId,
    comment_text,
  });

  // Increment comment count
  await Media.findByIdAndUpdate(mediaId, { $inc: { comments_count: 1 } });

  // Return new comment
  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

export const getAllCommentsForMedia = asyncHandler(async (req, res) => {
  const { mediaId } = req.params;

  // Check valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(mediaId)) {
    throw new ApiError(400, "Invalid media ID");
  }

  const comments = await MediaComment.aggregate([
    { $match: { media: new mongoose.Types.ObjectId(mediaId) } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 1,
        comment_text: 1,
        created_at: 1,
        "user._id": 1,
        "user.userName": 1,
        "user.avatar": 1,
      },
    },
    { $sort: { created_at: -1 } },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

export const getAllMediaPosts = asyncHandler(async (req, res) => {
  const posts = await Media.aggregate([
    // 1️⃣ Sort newest first
    { $sort: { createdAt: -1 } },

    // 2️⃣ Lookup user details
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          { $project: { userName: 1, avatar: 1 } }
        ]
      }
    },
    { $unwind: "$user" },

    // 3️⃣ Lookup latest comments (limit to 2)
    {
      $lookup: {
        from: "mediacomments",
        localField: "_id",
        foreignField: "media",
        as: "recentComments",
        pipeline: [
          { $sort: { createdAt: -1 } },
          { $limit: 2 },
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user",
              pipeline: [
                { $project: { userName: 1, avatar: 1 } }
              ]
            }
          },
          { $unwind: "$user" }
        ]
      }
    },

    // 4️⃣ Lookup total likes count
    {
      $lookup: {
        from: "medialikes",
        localField: "_id",
        foreignField: "media",
        as: "likes"
      }
    },
    {
      $addFields: {
        likes_count: { $size: "$likes" },
        comments_count: { $size: "$recentComments" }
      }
    },

    // 5️⃣ Cleanup
    {
      $project: {
        likes: 0
      }
    }
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Feed loaded successfully"));
});

export const deleteMediaPost = asyncHandler(async (req, res) => {
  const { mediaId } = req.params;
  const userId = req.user._id;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(mediaId)) {
    throw new ApiError(400, "Invalid media ID");
  }

  // Find the media post
  const media = await Media.findById(mediaId);
  if (!media) throw new ApiError(404, "Media post not found");

  // Check ownership
  if (String(media.user) !== String(userId)) {
    throw new ApiError(403, "Unauthorized to delete this media post");
  }

  // Delete associated likes and comments
  await Promise.all([
    MediaLike.deleteMany({ media: mediaId }),
    MediaComment.deleteMany({ media: mediaId }),
  ]);

  // Delete media files from Cloudinary
  try {
    if (Array.isArray(media.images) && media.images.length > 0) {
      for (const imageUrl of media.images) {
        await deleteFromCloudinary(imageUrl);
      }
    }

    if (media.video) {
      await deleteFromCloudinary(media.video);
    }
  } catch (err) {
    console.error("⚠️ Cloudinary deletion failed:", err.message);
  }

  // Delete the media document
  await Media.findByIdAndDelete(mediaId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Media post deleted successfully"));
});

