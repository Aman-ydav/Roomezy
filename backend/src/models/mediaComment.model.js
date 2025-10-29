import mongoose from "mongoose";

const mediaCommentSchema = new mongoose.Schema(
    {
        media: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Media",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        comment_text: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const MediaComment = mongoose.model("MediaComment", mediaCommentSchema);
