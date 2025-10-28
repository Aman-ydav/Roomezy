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
    throw new ApiError(403, "Unauthorized to edit this post");
  }

  // optional: update main image if provided
  if (req.files && req.files.main_image) {
    const mainImageUpload = await uploadOnCloudinary(req.files.main_image[0].path);
    updates.main_image = mainImageUpload.url;
  }

  const updatedPost = await Post.findByIdAndUpdate(post._id, { $set: updates }, { new: true });
  return res.status(200).json(new ApiResponse(200, updatedPost, "Post updated successfully"));
});

export const archivePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, "Post not found");

  if (String(post.user) !== String(req.user._id)) {
    throw new ApiError(403, "Unauthorized");
  }

  post.archived = true;
  await post.save();

  return res.status(200).json(new ApiResponse(200, {}, "Post archived successfully"));
});

export const togglePostStatus = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, "Post not found");

  post.status_badge = post.status_badge === "active" ? "closed" : "active";
  await post.save();

  return res.status(200).json(new ApiResponse(200, post, "Post status toggled"));
});

export const getSavedPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({ savedBy : req.user._id })
        .populate("user_id", "userName avatar rating")
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, posts, "Saved posts fetched"));
});

export const toggleSavePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) throw new ApiError(404, "Post not found");

    const idx = post.savedBy.indexOf(req.user._id);
    if (idx > -1) {
        post.savedBy.splice(idx, 1); // unsave
    } else {
        post.savedBy.push(req.user._id); // save
    }

    await post.save();
    res.status(200).json(new ApiResponse(200, post, "Post save toggled"));
});


