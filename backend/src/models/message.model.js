import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        text: {
            type: String,
            default: "",
        },

        deletedFor: {
            type: [mongoose.Schema.Types.ObjectId],
            default: [],
        },

        deletedForEveryone: { type: Boolean, default: false },
        deleteForEveryoneAt: { type: Date, default: null },

        mediaUrl: { type: String, default: null },

        messageType: {
            type: String,
            enum: ["text", "image", "video", "file"],
            default: "text",
        },

        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
