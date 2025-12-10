import express from "express";
import Subscription from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// save subscription
router.post("/subscribe", verifyJWT, asyncHandler(async (req,res)=>{
  const { endpoint, keys } = req.body;
  const userId = req.user._id;

  await Subscription.findOneAndUpdate(
    { userId },
    { endpoint, keys },
    { upsert: true }
  );

  res.json({ success: true });
}));

export default router;
