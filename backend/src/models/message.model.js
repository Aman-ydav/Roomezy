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

        read:        { type: Boolean, default: false },
        deliveredAt: { type: Date, default: null },
        readAt:      { type: Date, default: null },
        replyTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },
    },
    { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1 });

export const Message = mongoose.model("Message", messageSchema);
