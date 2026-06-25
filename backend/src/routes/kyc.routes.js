import { Router } from "express";
import {
  submitKyc,
  getKycStatus,
  createKycPaymentOrder,
  verifyKycPayment,
} from "../controllers/kyc.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { kycUpload } from "../middlewares/multer.middleware.js";
import { kycLimiter, paymentLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

router.post(
  "/submit",
  verifyJWT,
  kycLimiter,
  kycUpload.fields([{ name: "selfie", maxCount: 1 }, { name: "document", maxCount: 1 }]),
  submitKyc
);

router.get("/status",           verifyJWT, getKycStatus);
router.post("/payment/order",   verifyJWT, paymentLimiter, createKycPaymentOrder);
router.post("/payment/verify",  verifyJWT, paymentLimiter, verifyKycPayment);

export default router;
