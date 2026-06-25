import { Router } from "express";
import {
  createPostCreditsOrder,
  verifyPostCreditsPayment,
  getCreditsBalance,
  getPaymentHistory,
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { paymentLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

router.post("/post-credits/order",  verifyJWT, paymentLimiter, createPostCreditsOrder);
router.post("/post-credits/verify", verifyJWT, paymentLimiter, verifyPostCreditsPayment);
router.get("/credits-balance",      verifyJWT, getCreditsBalance);
router.get("/history",              verifyJWT, getPaymentHistory);

export default router;
