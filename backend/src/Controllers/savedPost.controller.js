import { SavedPost } from "../models/savedPost.model.js";
import { Post } from "../models/post.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const toggleSavePost = asyncHandler(async (req, res) => {
  const { id } = req.params; // post id
  const userId = req.user._id;

  const post = await Post.findById(id);
  if (!post) throw new ApiError(404, "Post not found");

  const existing = await SavedPost.findOne({ user: userId, post: id });

  if (existing) {
    // Unsave
    await existing.deleteOne();
    
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Post unsaved successfully"));
  }

  // Save
  await SavedPost.create({ user: userId, post: id });
  res.status(201).json(new ApiResponse(201, null, "Post saved successfully"));
});

export const getSavedPosts = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const savedPosts = await SavedPost.aggregate([
    // Match saved posts for this user
    { $match: { user: userId } },

    // Lookup post details
    {
      $lookup: {
        from: "posts",
        localField: "post",
        foreignField: "_id",
        as: "post",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user",
              pipeline: [
                { $project: { userName: 1, avatar: 1, rating: 1 } },
              ],
            },
          },
          { $unwind: "$user" },
        ],
      },
    },
    { $unwind: "$post" },
    { $sort: { createdAt: -1 } },
    { $limit: 10 },
  ]);

  res.status(200).json(new ApiResponse(200, savedPosts, "Saved posts fetched"));
});
