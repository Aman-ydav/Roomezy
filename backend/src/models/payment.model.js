import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ["kyc", "post_credits"],
            required: true,
        },
        amount: {
            type: Number,
            required: true,  // in rupees
        },
        quantity: {
            type: Number,
            default: 1,      // for post_credits: credits purchased
        },
        razorpayOrderId:   { type: String, required: true, unique: true },
        razorpayPaymentId: { type: String, default: null },
        status: {
            type: String,
            enum: ["created", "paid", "failed"],
            default: "created",
        },
    },
    { timestamps: true }
);

paymentSchema.index({ userId: 1, type: 1 });
paymentSchema.index({ razorpayOrderId: 1 });

export const Payment = mongoose.model("Payment", paymentSchema);
