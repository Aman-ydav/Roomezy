import {
  createPost,
  getAllPosts,
  getFeed,
  getPostById,
  toggleArchivePost,
  togglePostStatus,
  ratePost,
  deletePost,
  updatePostBasic,
  updatePostPreferences,
  updatePostImages,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { postCreateLimiter } from "../middlewares/rateLimiter.js";
import { Router } from "express";

const router = Router();

// Upload fields setup (main image required, media optional)
const postUploads = upload.fields([
  { name: "main_image", maxCount: 1 },
  { name: "media_files", maxCount: 3 },
]);

router.route("/create-post").post(verifyJWT, postCreateLimiter, postUploads, createPost);
router.route("/").get(getAllPosts);
router.route("/feed").get(getFeed);
router.route("/:id").get(getPostById);
router.route("/:id/archive").patch(verifyJWT, toggleArchivePost);
router.route("/:id/status").patch(verifyJWT, togglePostStatus);
router.route("/:id/rate").patch(verifyJWT, ratePost);
router.route("/:id").delete(verifyJWT, deletePost);

router.route("/:id/basic").patch(verifyJWT, updatePostBasic); 
router.route("/:id/preferences").patch(verifyJWT, updatePostPreferences);  
router.route("/:id/images").patch(verifyJWT, postUploads, updatePostImages); 

export default router;
