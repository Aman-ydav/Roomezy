import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  toggleArchivePost,
  togglePostStatus,
  ratePost,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";

const router = Router();

// Upload fields setup (main image required, media optional)
const postUploads = upload.fields([
  { name: "main_image", maxCount: 1 },
  { name: "media_files", maxCount: 3 },
]);

router.route("/create-post").post(verifyJWT, postUploads, createPost);
router.route("/").get(getAllPosts);
router.route("/:id").get(getPostById);
router.route("/:id").put(verifyJWT, postUploads, updatePost);
router.route("/:id/archive").patch(verifyJWT, toggleArchivePost);
router.route("/:id/status").patch(verifyJWT, togglePostStatus);
router.route("/:id/rate").patch(verifyJWT, ratePost);


export default router;
