import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { cleanupLocalFiles } from "../utils/fileCleanUp.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

export const createPost = asyncHandler(async (req, res) => {
  // Post credit gate — owners get 5 free posts, then ₹49/post
  if (req.user.accountType === "ownerLookingForRenters") {
    const totalPosts = await Post.countDocuments({ user: req.user._id });
    if (totalPosts >= 5) {
      const owner = await User.findById(req.user._id).select("postCreditsBalance");
      if (!owner || owner.postCreditsBalance < 1) {
        cleanupLocalFiles(req.files);
        throw new ApiError(402, "Post limit reached. Purchase post credits to continue.");
      }
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { postCreditsBalance: -1 },
      });
    }
  }
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

  // Validate required fields
  if (!post_type || !title || !description || !location) {
    cleanupLocalFiles(req.files);
    throw new ApiError(400, "Missing required fields");
  }

  // Validate and upload main image
  if (!req.files || !req.files.main_image) {
    throw new ApiError(400, "Main image is required");
  }

  const mainImagePath = req.files.main_image[0].path;
  const mainImageUpload = await uploadOnCloudinary(mainImagePath);

  if (!mainImageUpload?.url) {
    cleanupLocalFiles(req.files.main_image);
    throw new ApiError(500, "Failed to upload main image");
  }

  // Upload additional images (optional)
  let additionalImages = [];
  if (req.files.media_files) {
    for (let file of req.files.media_files.slice(0, 3)) {
      const uploaded = await uploadOnCloudinary(file.path);
      if (uploaded?.url) additionalImages.push(uploaded.url);
    }
  }

  // Create the post in MongoDB
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
    additional_images: additionalImages, // ✅ FIXED FIELD NAME
    non_smoker,
    lgbtq_friendly,
    has_cat,
    has_dog,
    allow_pets,
  });

  // Cleanup temp files
  cleanupLocalFiles(req.files);

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

export const getAllPosts = asyncHandler(async (req, res) => {
  const {
    q,
    type,
    rentMin,
    rentMax,
    city,
    lat,
    lng,
    radius = 10,
    page = 1,
    limit = 20,
    sort = "newest",
  } = req.query;

  const filter = { archived: false };

  if (q) filter.$text = { $search: q };
  if (type) filter.post_type = type;
  if (city) filter.location = { $regex: new RegExp(city, "i") };
  if (rentMin || rentMax) {
    filter.rent = {};
    if (rentMin) filter.rent.$gte = Number(rentMin);
    if (rentMax) filter.rent.$lte = Number(rentMax);
  }

  // Geo filter — proximity search when lat/lng provided
  if (lat && lng) {
    filter.geoLocation = {
      $near: {
        $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(radius) * 1000,
      },
    };
  }

  const sortMap = {
    newest:    { createdAt: -1 },
    oldest:    { createdAt: 1 },
    cheapest:  { rent: 1 },
    expensive: { rent: -1 },
    rating:    { averageRating: -1 },
  };
  const sortQuery = q
    ? { score: { $meta: "textScore" }, ...sortMap[sort] }
    : (sortMap[sort] || sortMap.newest);

  const projection = q ? { score: { $meta: "textScore" } } : {};

  const skip  = (Number(page) - 1) * Number(limit);
  const [posts, total] = await Promise.all([
    Post.find(filter, projection)
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit))
      .populate("user", "userName age avatar rating kycStatus"),
    Post.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      posts,
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
    }, "Posts fetched")
  );
});

export const getFeed = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const user = userId
    ? await User.findById(userId).select("budgetMin budgetMax city kycStatus")
    : null;

  const basePosts = await Post.find({ archived: false, status_badge: "active" })
    .sort({ createdAt: -1 })
    .limit(300)
    .populate("user", "userName age avatar rating kycStatus");

  const now = Date.now();
  const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

  const scored = basePosts.map((post) => {
    let score = 0;

    // City match
    if (user?.city && post.location?.toLowerCase().includes(user.city.toLowerCase())) {
      score += 40;
    }
    // Budget match
    if (user?.budgetMin != null && user?.budgetMax != null && post.rent) {
      const inBudget = post.rent >= user.budgetMin && post.rent <= user.budgetMax;
      if (inBudget) score += 30;
    }
    // Recency (max +20 for posts < 1 day, 0 for posts > 30 days)
    const ageRatio = Math.min(1, (now - new Date(post.createdAt).getTime()) / MAX_AGE_MS);
    score += Math.round(20 * (1 - ageRatio));

    // Rating
    if (post.averageRating >= 4) score += 10;
    else if (post.averageRating >= 3) score += 5;

    // Photos
    const photoCount = (post.additional_images?.length || 0) + (post.main_image ? 1 : 0);
    if (photoCount >= 3) score += 5;

    // KYC verified owner
    if (post.user?.kycStatus === "verified") score += 20;

    return { post, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const paginated = scored.slice(skip, skip + Number(limit)).map((s) => s.post);

  return res.status(200).json(
    new ApiResponse(200, {
      posts: paginated,
      total: scored.length,
      page:  Number(page),
      pages: Math.ceil(scored.length / Number(limit)),
    }, "Feed fetched")
  );
});

export const getPostById = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user?._id;

  const post = await Post.findById(postId)
    .populate("user", "userName avatar rating age kycStatus");

  if (!post) throw new ApiError(404, "Post not found");

  // Check if saved by user
  let isSaved = false;
  if (userId) {
    const saved = await SavedPost.findOne({
      user: userId,
      post: postId,
    });

    isSaved = !!saved;
  }

  const postWithSaveFlag = {
    ...post.toObject(),
    isSaved,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, postWithSaveFlag, "Post details fetched"));
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

export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid post ID");
  }

  // Find post
  const post = await Post.findById(id);
  if (!post) throw new ApiError(404, "Post not found");

  // Authorization check
  if (String(post.user) !== String(req.user._id)) {
    throw new ApiError(403, "Unauthorized to delete this post");
  }

  // Delete files from Cloudinary
  try {
    // main image
    if (post.main_image) {
      await deleteFromCloudinary(post.main_image);
    }

    // multiple media files
    if (Array.isArray(post.media_urls) && post.media_urls.length > 0) {
      for (const url of post.media_urls) {
        await deleteFromCloudinary(url);
      }
    }
  } catch (err) {
    console.error("Cloudinary deletion error:", err.message);
  }

  // Delete the post document
  await Post.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});

export const updatePostBasic = asyncHandler(async (req, res) => {
  const { title, description, location, rent, room_type } = req.body;
  const post = await Post.findById(req.params.id);

  if (!post) throw new ApiError(404, "Post not found");
  if (String(post.user) !== String(req.user._id)) {
    throw new ApiError(403, "Unauthorized to edit this post");
  }

  const updates = { title, description, location, rent, room_type };
  const updatedPost = await Post.findByIdAndUpdate(
    post._id,
    { $set: updates },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Basic information updated successfully"));
});

export const updatePostPreferences = asyncHandler(async (req, res) => {
  const { non_smoker, lgbtq_friendly, has_cat, has_dog, allow_pets } = req.body;
  const post = await Post.findById(req.params.id);

  if (!post) throw new ApiError(404, "Post not found");
  if (String(post.user) !== String(req.user._id)) {
    throw new ApiError(403, "Unauthorized to edit this post");
  }

  const updates = { non_smoker, lgbtq_friendly, has_cat, has_dog, allow_pets };
  const updatedPost = await Post.findByIdAndUpdate(
    post._id,
    { $set: updates },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Preferences updated successfully"));
});

export const updatePostImages = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) throw new ApiError(404, "Post not found");
  if (String(post.user) !== String(req.user._id)) {
    cleanupLocalFiles(req.files);
    throw new ApiError(403, "Unauthorized to edit this post");
  }

  try {
    const updates = {};

    // Delete old main image from Cloudinary if a new one is provided
    if (req.files && req.files.main_image) {
      if (post.main_image) {
        await deleteFromCloudinary(post.main_image);
      }
      const mainImageUpload = await uploadOnCloudinary(req.files.main_image[0].path);
      if (!mainImageUpload?.url) {
        cleanupLocalFiles(req.files);
        throw new ApiError(500, "Failed to upload main image");
      }
      updates.main_image = mainImageUpload.url;
    }

    // Delete old additional images from Cloudinary if new ones are provided
    if (req.files && req.files.media_files) {
      if (Array.isArray(post.additional_images) && post.additional_images.length > 0) {
        for (const url of post.additional_images) {
          await deleteFromCloudinary(url);
        }
      }
      const mediaUploads = [];
      for (let file of req.files.media_files.slice(0, 3)) {
        const uploaded = await uploadOnCloudinary(file.path);
        if (uploaded?.url) mediaUploads.push(uploaded.url);
      }
      if (mediaUploads.length > 0) {
        updates.additional_images = mediaUploads;
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(
      post._id,
      { $set: updates },
      { new: true }
    );

    cleanupLocalFiles(req.files);
    return res
      .status(200)
      .json(new ApiResponse(200, updatedPost, "Images updated successfully"));
  } catch (error) {
    cleanupLocalFiles(req.files);
    throw error;
  }
});