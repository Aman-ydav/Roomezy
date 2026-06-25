import { razorpay, verifyPaymentSignature } from "../utils/razorpay.js";
import { Payment } from "../models/payment.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../utils/createNotification.js";
import { notifyUser } from "../socket/index.js";

// POST /api/v1/payments/post-credits/order
export const createPostCreditsOrder = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  if (!quantity || !Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
    throw new ApiError(400, "Quantity must be a positive integer");
  }

  const qty = Number(quantity);
  const amount = qty * 49;

  let order;
  try {
    order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `cr_${Date.now()}`,
    });
  } catch (rzErr) {
    console.error("[Payment] Razorpay order create error:", rzErr);
    const msg = rzErr?.error?.description || rzErr?.message || "Failed to create payment order";
    throw new ApiError(502, msg);
  }

  try {
    await Payment.create({
      userId: req.user._id,
      type: "post_credits",
      amount,
      quantity: qty,
      razorpayOrderId: order.id,
    });
  } catch (dbErr) {
    console.error("[Payment] DB save error:", dbErr);
    throw new ApiError(500, dbErr.message || "Failed to save order");
  }

  res.status(201).json(
    new ApiResponse(201, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      quantity: qty,
      keyId: process.env.RAZORPAY_KEY_ID,
    }, "Order created")
  );
});

// POST /api/v1/payments/post-credits/verify
export const verifyPostCreditsPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new ApiError(400, "Missing payment fields");
  }

  const isValid = verifyPaymentSignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });

  if (!isValid) throw new ApiError(400, "Invalid payment signature");

  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId, status: "created" },
    { razorpayPaymentId, status: "paid" },
    { new: true }
  );

  if (!payment) throw new ApiError(404, "Order not found or already processed");

  await User.findByIdAndUpdate(payment.userId, {
    $inc: { postCreditsBalance: payment.quantity },
  });

  await createNotification({
    userId: payment.userId,
    type:   "credits_added",
    title:  "Post Credits Added",
    body:   `${payment.quantity} post credit${payment.quantity > 1 ? "s" : ""} have been added to your account. You can now publish ${payment.quantity} more listing${payment.quantity > 1 ? "s" : ""}.`,
    link:   "/dashboard",
    meta:   { creditsAdded: payment.quantity },
  });
  notifyUser(payment.userId.toString());

  res.json(
    new ApiResponse(200, {
      creditsAdded: payment.quantity,
    }, `${payment.quantity} post credit(s) added`)
  );
});

// GET /api/v1/payments/credits-balance
export const getCreditsBalance = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("postCreditsBalance");
  res.json(new ApiResponse(200, { balance: user.postCreditsBalance }, "Credits balance"));
});

// GET /api/v1/payments/history
export const getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(new ApiResponse(200, payments, "Payment history"));
});
