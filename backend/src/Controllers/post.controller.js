import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { cleanupLocalFiles } from "../utils/fileCleanUp.js";

export const createPost = asyncHandler(async (req, res) => {
  const {
    post_type,
    post_role,
    title,
    description,
    location,
    rent,
    room_type,
    badge_type, 
    non_smoker,
    lgbtq_friendly,
    has_cat,
    has_dog,
    allow_pets,
  } = req.body;

  if (!post_type || !title || !description || !location || !rent) {
    cleanupLocalFiles(req.files);
    throw new ApiError(400, "Missing required fields");
  }

  // upload main image
  if (!req.files || !req.files.main_image) {
    throw new ApiError(400, "Main image is required");
  }

  const mainImagePath = req.files.main_image[0].path;

  const mainImageUpload = await uploadOnCloudinary(mainImagePath);
  if (!mainImageUpload?.url) {
    cleanupLocalFiles(req.files.main_image);
    throw new ApiError(500, "Failed to upload main image");
  }

  // upload additional media (if any)
  let mediaUploads = [];
  if (req.files.media_files) {
    for (let file of req.files.media_files.slice(0, 3)) {
      const uploaded = await uploadOnCloudinary(file.path);
      if (uploaded?.url) mediaUploads.push(uploaded.url);
    }
  }

  const post = await Post.create({
    user: req.user._id,
    post_type,
    post_role,
    title,
    description,
    location,
    rent,
    room_type,
    badge_type,
    main_image: mainImageUpload.url,
    media_urls: mediaUploads,
    non_smoker,
    lgbtq_friendly,
    has_cat,
    badge_type,
    has_dog,
    allow_pets,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ archived: false }).populate("user", "userName age avatar rating");
  return res.status(200).json(new ApiResponse(200, posts, "Posts fetched"));
});

export const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("user", "userName avatar rating age");
  if (!post) throw new ApiError(404, "Post not found");
  return res.status(200).json(new ApiResponse(200, post, "Post details fetched"));
});

export const updatePost = asyncHandler(async (req, res) => {
  const updates = req.body;
  const post = await Post.findById(req.params.id);

  if (!post) throw new ApiError(404, "Post not found");
  if (String(post.user) !== String(req.user._id)) {
    cleanupLocalFiles(req.files);
    throw new ApiError(403, "Unauthorized to edit this post");
  }

  try {
    // optional: update main image if provided
    if (req.files && req.files.main_image) {
      const mainImageUpload = await uploadOnCloudinary(req.files.main_image[0].path);

      if (!mainImageUpload?.url) {
        cleanupLocalFiles(req.files);
        throw new ApiError(500, "Failed to upload main image");
      }

      updates.main_image = mainImageUpload.url;
    }

    // optional: update media files if provided
    if (req.files && req.files.media_files) {
      const mediaUploads = [];
      for (let file of req.files.media_files.slice(0, 3)) {
        const uploaded = await uploadOnCloudinary(file.path);
        if (uploaded?.url) mediaUploads.push(uploaded.url);
      }
      if (mediaUploads.length > 0) {
        updates.media_urls = mediaUploads;
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(
      post._id,
      { $set: updates },
      { new: true }
    );

    cleanupLocalFiles(req.files); // cleanup after upload succeeds
    return res
      .status(200)
      .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
  } catch (error) {
    cleanupLocalFiles(req.files); // cleanup on any error
    throw error;
  }
});

export const toggleArchivePost = asyncHandler(async (req, res) => {
   const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, "Post not found");

  post.archived = !post.archived; 
  await post.save();

  return res.status(200).json(new ApiResponse(200, post, "Post archive toggled"));
});

export const togglePostStatus = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, "Post not found");

  post.status_badge = post.status_badge === "active" ? "closed" : "active";
  await post.save();

  return res.status(200).json(new ApiResponse(200, post, "Post status toggled"));
});

export const ratePost = asyncHandler(async (req, res) => {
  const { value } = req.body; // Expected: 1–5
  const { id: postId } = req.params;
  const userId = req.user._id;

  // Validate input
  if (typeof value !== "number" || value < 1 || value > 5) {
    throw new ApiError(400, "Rating value must be a number between 1 and 5");
  }

  // Find post
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  // Ensure array exists
  if (!Array.isArray(post.rating)) post.rating = [];

  // Check if user already rated
  const existing = post.rating.find(
    (r) => r.user?.toString() === userId.toString()
  );

  // validation on own post rating
  if (post.user.toString() === userId.toString()) {
    throw new ApiError(400, "You cannot rate your own post");
  }


  if (existing) {
    existing.value = value;
  } else {
    post.rating.push({ user: userId, value });
  }

  // Recalculate average rating safely
  const totalRatings = post.rating.length;
  const totalValue = post.rating.reduce((sum, r) => sum + (r.value || 0), 0);

  post.averageRating =
    totalRatings > 0 ? Number((totalValue / totalRatings).toFixed(2)) : 0;

  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Rating submitted successfully"));
});




