import { User } from "../models/user.model.js";
import { Payment } from "../models/payment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { compareFaces } from "../utils/faceMatch.js";
import { razorpay, verifyPaymentSignature } from "../utils/razorpay.js";
import { v2 as cloudinary } from "cloudinary";

async function uploadBufferToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image", access_mode: "authenticated" },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

// POST /api/v1/kyc/submit
export const submitKyc = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.kycStatus === "verified") {
    throw new ApiError(400, "Already verified");
  }
  if (user.kycAttempts >= 3) {
    throw new ApiError(400, "All 3 attempts used. Contact support.");
  }
  if (user.kycStatus === "awaiting_payment") {
    throw new ApiError(400, "A matched verification is awaiting payment. Pay within the deadline.");
  }

  const selfieFile   = req.files?.selfie?.[0];
  const documentFile = req.files?.document?.[0];
  const { documentType } = req.body;

  if (!selfieFile || !documentFile) {
    throw new ApiError(400, "Both selfie and document photo are required");
  }
  if (!["aadhaar", "pan", "passport"].includes(documentType)) {
    throw new ApiError(400, "Invalid document type");
  }

  // Upload both images to Cloudinary (private/authenticated)
  const [selfieUpload, docUpload] = await Promise.all([
    uploadBufferToCloudinary(selfieFile.buffer, "kyc/selfies"),
    uploadBufferToCloudinary(documentFile.buffer, "kyc/documents"),
  ]);

  // Run face comparison
  let result;
  try {
    result = await compareFaces(selfieFile.buffer, documentFile.buffer);
  } catch (err) {
    const newAttempts = user.kycAttempts + 1;
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { kycAttempts: 1 },
      kycSelfieUrl:   selfieUpload.secure_url,
      kycDocumentUrl: docUpload.secure_url,
      kycStatus: newAttempts >= 3 ? "attempts_exhausted" : "none",
    });
    throw new ApiError(422, `Face detection failed: ${err.message}`);
  }

  if (result.matched) {
    const deadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    await User.findByIdAndUpdate(req.user._id, {
      kycStatus:          "awaiting_payment",
      kycMatchedAt:       new Date(),
      kycPaymentDeadline: deadline,
      kycDocumentType:    documentType,
      kycSelfieUrl:       selfieUpload.secure_url,
      kycDocumentUrl:     docUpload.secure_url,
    });
    return res.json(new ApiResponse(200, {
      matched:         true,
      confidence:      result.confidence,
      paymentDeadline: deadline,
    }, "Face matched. Pay ₹99 within 3 days to activate your badge."));
  }

  const newAttempts = user.kycAttempts + 1;
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { kycAttempts: 1 },
    kycStatus:      newAttempts >= 3 ? "attempts_exhausted" : "none",
    kycSelfieUrl:   selfieUpload.secure_url,
    kycDocumentUrl: docUpload.secure_url,
  });

  return res.json(new ApiResponse(200, {
    matched:           false,
    confidence:        result.confidence,
    attemptsUsed:      newAttempts,
    attemptsRemaining: Math.max(0, 3 - newAttempts),
  }, newAttempts >= 3
    ? "All attempts exhausted. Contact support."
    : `Face did not match. ${3 - newAttempts} attempt(s) remaining.`
  ));
});

// GET /api/v1/kyc/status
export const getKycStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "kycStatus kycAttempts kycMatchedAt kycPaymentDeadline kycVerifiedAt kycDocumentType"
  );
  res.json(new ApiResponse(200, user, "KYC status"));
});

// POST /api/v1/kyc/payment/order
export const createKycPaymentOrder = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.kycStatus !== "awaiting_payment") {
    throw new ApiError(400, "No successful face match pending payment");
  }
  if (new Date() > user.kycPaymentDeadline) {
    await User.findByIdAndUpdate(req.user._id, {
      kycStatus: "none",
      kycMatchedAt: null,
      kycPaymentDeadline: null,
    });
    throw new ApiError(400, "Payment deadline expired. Please redo verification.");
  }

  const order = await razorpay.orders.create({
    amount: 9900,
    currency: "INR",
    receipt: `kyc_${req.user._id}`,
  });

  await Payment.create({
    userId: req.user._id,
    type: "kyc",
    amount: 99,
    razorpayOrderId: order.id,
  });

  res.status(201).json(new ApiResponse(201, {
    orderId:  order.id,
    amount:   order.amount,
    currency: order.currency,
    keyId:    process.env.RAZORPAY_KEY_ID,
  }, "KYC payment order created"));
});

// POST /api/v1/kyc/payment/verify
export const verifyKycPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new ApiError(400, "Missing payment fields");
  }

  const isValid = verifyPaymentSignature({
    orderId:   razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });
  if (!isValid) throw new ApiError(400, "Invalid payment signature");

  const user = await User.findById(req.user._id);
  if (new Date() > user.kycPaymentDeadline) {
    throw new ApiError(400, "Payment deadline expired");
  }

  await Payment.findOneAndUpdate(
    { razorpayOrderId, status: "created" },
    { razorpayPaymentId, status: "paid" }
  );

  await User.findByIdAndUpdate(req.user._id, {
    kycStatus:          "verified",
    kycVerifiedAt:      new Date(),
    kycMatchedAt:       null,
    kycPaymentDeadline: null,
  });

  res.json(new ApiResponse(200, { kycStatus: "verified" }, "Identity verified. Badge activated."));
});
