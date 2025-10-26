import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  archivePost,
  togglePostStatus,
  toggleSavePost,
  getSavedPosts,
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

router.post("/", verifyJWT, postUploads, createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.put("/:id", verifyJWT, postUploads, updatePost);
router.delete("/:id", verifyJWT, archivePost);
router.patch("/:id/toggle-status", verifyJWT, togglePostStatus);

router.route("/saved").get(verifyJWT, getSavedPosts);

router.route("/save/:id").patch(verifyJWT, toggleSavePost);

export default router;
