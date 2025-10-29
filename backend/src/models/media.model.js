import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        images: {
            type: [String],
            validate: {
                validator: function (val) {
                    return !val || val.length <= 3;
                },
                message: "You can upload up to 3 images only.",
            },
        },
        video: {
            type: String,
        },
        likes_count: {
            type: Number,
            default: 0,
        },
        comments_count: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export const Media = mongoose.model("Media", mediaSchema);
