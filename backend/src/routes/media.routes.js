import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createMediaPost,
  getAllMediaPosts,
  toggleLikeMedia,
  addComment,
} from "../controllers/media.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/").get(verifyJWT, getAllMediaPosts);

router.route("/").post(verifyJWT,
    upload.fields([
      { name: "images", maxCount: 3 },
      { name: "video", maxCount: 1 },
    ]),
    createMediaPost
  );


router
  .route("/:mediaId/like")
  .post(verifyJWT, toggleLikeMedia);

router
  .route("/:mediaId/comment")
  .post(verifyJWT, addComment);

export default router;
