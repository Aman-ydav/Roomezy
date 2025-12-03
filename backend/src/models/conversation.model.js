import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],

        lastMessage: {
            type: String,
            default: "",
        },

        lastMessageAt: {
            type: Date,
            default: null,
        },

        lastMessageSender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        unreadCount: {
            type: Map, // { userId: number }
            of: Number,
            default: {},
        },
    },
    { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
