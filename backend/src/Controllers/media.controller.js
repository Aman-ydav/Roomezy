import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Media } from "../models/media.model.js";
import { MediaLike } from "../models/mediaLike.model.js";
import { MediaComment } from "../models/mediaComment.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { cleanupLocalFiles } from "../utils/fileCleanUp.js";


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

  return res
    .status(201)
    .json(new ApiResponse(201, media, "Media post created successfully"));
});

export const getAllMediaPosts = asyncHandler(async (req, res) => {
  const posts = await Media.find()
    .populate("user", "userName avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Media posts fetched successfully"));
});

export const toggleLikeMedia = asyncHandler(async (req, res) => {
  const { mediaId } = req.params;
  const userId = req.user._id;

  const existingLike = await MediaLike.findOne({ media: mediaId, user: userId });

  if (existingLike) {
    await MediaLike.deleteOne({ _id: existingLike._id });
    await Media.findByIdAndUpdate(mediaId, { $inc: { likes_count: -1 } });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Media unliked successfully"));
  }

  await MediaLike.create({ media: mediaId, user: userId });
  await Media.findByIdAndUpdate(mediaId, { $inc: { likes_count: 1 } });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Media liked successfully"));
});

export const addComment = asyncHandler(async (req, res) => {
  const { mediaId } = req.params;
  const { comment_text } = req.body;
  const userId = req.user._id;

  if (!comment_text?.trim()) throw new ApiError(400, "Comment text is required");

  const comment = await MediaComment.create({
    media: mediaId,
    user: userId,
    comment_text,
  });

  await Media.findByIdAndUpdate(mediaId, { $inc: { comments_count: 1 } });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});
