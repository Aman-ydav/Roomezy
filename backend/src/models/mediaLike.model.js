import mongoose from "mongoose";

const mediaLikeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        media: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Media",
            required: true,
        },
    },
    { timestamps: true }
);

mediaLikeSchema.index({ user: 1, media: 1 }, { unique: true }); // One like per user per post

export const MediaLike = mongoose.model("MediaLike", mediaLikeSchema);
