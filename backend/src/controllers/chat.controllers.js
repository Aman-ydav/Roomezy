import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ------------------ CREATE OR GET CONVERSATION ------------------
export const createOrGetConversation = asyncHandler(async (req, res) => {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
        throw new ApiError(400, "senderId and receiverId required");
    }

    if (String(senderId) === String(receiverId)) {
        throw new ApiError(400, "You cannot start a chat with yourself");
    }

    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
    }).populate("participants", "userName avatar createdAt");

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [senderId, receiverId],
            unreadCount: {
                [senderId]: 0,
                [receiverId]: 0,
            },
            lastMessage: "",
            lastMessageSender: null,
        });

        conversation = await Conversation.findById(conversation._id).populate(
            "participants",
            "userName avatar createdAt"
        );
    }

    return res
        .status(200)
        .json(new ApiResponse(200, conversation, "Conversation fetched/created"));
});

// ------------------ GET USER CONVERSATIONS ------------------
export const getUserConversations = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) throw new ApiError(400, "userId is required");

    const conversations = await Conversation.find({
        participants: userId,
    })
        .populate("participants", "userName avatar createdAt")
        .sort({ updatedAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, conversations, "User conversations fetched"));
});

// ------------------ GET MESSAGES ------------------
export const getMessages = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;

    if (!conversationId) throw new ApiError(400, "conversationId required");

    const messages = await Message.find({ conversationId }).sort({
        createdAt: 1,
    });

    const userId = req.user?._id;

    const filtered = messages
        .filter((m) => !m.deletedFor?.includes(userId)) // deleted for me — hide
        .map((m) => {
            const msg = m.toObject();

            // compute 1-hour expiry for delete-for-everyone option
            const diff = Date.now() - new Date(msg.createdAt).getTime();
            msg.canDeleteForEveryone = diff <= 60 * 60 * 1000;

            if (m.deletedForEveryone) {
                msg.text = "";
                msg.deletedForEveryone = true;
                msg.canDeleteForEveryone = false; // can't delete again
            }

            return msg;
        });

    return res
        .status(200)
        .json(new ApiResponse(200, filtered, "Messages fetched"));
});


// ------------------ SEND MESSAGE ------------------
export const sendMessage = asyncHandler(async (req, res) => {
    const { senderId, receiverId, conversationId, text } = req.body;

    if (!senderId || !receiverId || !conversationId || !text) {
        throw new ApiError(400, "Missing fields for sending message");
    }

    const message = await Message.create({
        sender: senderId,
        receiver: receiverId,
        conversationId,
        text,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: text,
        lastMessageSender: senderId,
        lastMessageAt: new Date(),
        $inc: { [`unreadCount.${receiverId}`]: 1 },
    });

    return res
        .status(201)
        .json(new ApiResponse(201, message, "Message sent successfully"));
});

// ------------------ MARK AS READ ------------------
export const markMessagesAsRead = asyncHandler(async (req, res) => {
    const { conversationId, userId } = req.params;

    await Message.updateMany(
        { conversationId, receiver: userId, read: false },
        { read: true }
    );

    await Conversation.findByIdAndUpdate(conversationId, {
        [`unreadCount.${userId}`]: 0,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Messages marked as read"));
});

// ------------------ DELETE FOR EVERYONE ------------------
export const deleteMessageForEveryone = asyncHandler(async (req, res) => {
    const { messageId, userId } = req.body;

    const msg = await Message.findById(messageId);
    if (!msg) throw new ApiError(404, "Message not found");

    if (String(msg.sender) !== String(userId)) {
        throw new ApiError(403, "Only sender can delete for everyone");
    }

    const hour = 60 * 60 * 1000;
    if (Date.now() - msg.createdAt.getTime() > hour) {
        throw new ApiError(400, "Delete for everyone expired");
    }

    msg.text = "";
    msg.deletedForEveryone = true;
    msg.deleteForEveryoneAt = new Date();
    await msg.save();

    return res.status(200).json(
        new ApiResponse(200,
            { message: msg, conversationId: msg.conversationId },
            "Message deleted for everyone"
        )
    );
});

// ------------------ DELETE FOR ME ------------------
export const deleteMessageForMe = asyncHandler(async (req, res) => {
    const { messageId, userId } = req.body;

    const msg = await Message.findById(messageId);
    if (!msg) throw new ApiError(404, "Message not found");

    if (!msg.deletedFor.includes(userId)) {
        msg.deletedFor.push(userId);
        await msg.save();
    }

    return res.status(200).json(
        new ApiResponse(200,
            { message: msg, conversationId: msg.conversationId },
            "Message deleted for user"
        )
    );
});

// ------------------ DELETE CHAT FOR ME ------------------
export const deleteChatForMe = asyncHandler(async (req, res) => {
    const { conversationId, userId } = req.body;

    await Message.updateMany(
        { conversationId },
        { $addToSet: { deletedFor: userId } }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Chat deleted for user"));
});
