import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: [
                "new_message",
                "post_saved",
                "post_viewed",
                "new_post_in_area",
                "kyc_verified",
                "kyc_rejected",
                "credits_added",
            ],
            required: true,
        },
        title:  { type: String, required: true },
        body:   { type: String, required: true },
        link:   { type: String, default: null },
        read:   { type: Boolean, default: false },
        meta:   { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
