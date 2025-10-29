import express from "express";
import { toggleSavePost, getSavedPosts } from "../controllers/savedPost.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/:id/toggle", verifyJWT, toggleSavePost);

router.get("/", verifyJWT, getSavedPosts);


export default router;
