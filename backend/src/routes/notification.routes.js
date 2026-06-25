import express from "express";
import Subscription from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getNotifications,
  markAllRead,
  markOneRead,
  deleteOne,
  deleteAll,
} from "../controllers/notification.controller.js";

const router = express.Router();

// Save / upsert push subscription
router.post("/subscribe", verifyJWT, asyncHandler(async (req, res) => {
  const { endpoint, keys } = req.body;
  await Subscription.findOneAndUpdate(
    { userId: req.user._id },
    { userId: req.user._id, endpoint, keys },
    { upsert: true, new: true }
  );
  res.json({ success: true });
}));

// In-app notification center
router.get("/",              verifyJWT, getNotifications);
router.patch("/read-all",    verifyJWT, markAllRead);
router.patch("/:id/read",    verifyJWT, markOneRead);
router.delete("/",           verifyJWT, deleteAll);
router.delete("/:id",        verifyJWT, deleteOne);

export default router;
