import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Helper — verify the requesting user is a participant in the conversation
async function assertParticipant(conversationId, userId) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new ApiError(404, "Conversation not found");
    if (!conversation.participants.map(String).includes(String(userId))) {
        throw new ApiError(403, "Not a participant of this conversation");
    }
    return conversation;
}

// ------------------ CREATE OR GET CONVERSATION ------------------
export const createOrGetConversation = asyncHandler(async (req, res) => {
    const senderId = req.user._id;
    const { receiverId } = req.body;

    if (!receiverId) {
        throw new ApiError(400, "receiverId required");
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
    const userId = req.user._id;

    const conversations = await Conversation.find({
        participants: userId,
    })
        .populate("participants", "userName avatar createdAt kycStatus")
        .sort({ updatedAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, conversations, "User conversations fetched"));
});

// ------------------ GET MESSAGES ------------------
export const getMessages = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.user._id;

    if (!conversationId) throw new ApiError(400, "conversationId required");

    await assertParticipant(conversationId, userId);

    const messages = await Message.find({ conversationId }).sort({
        createdAt: 1,
    });

    const filtered = messages
        .filter((m) => !m.deletedFor?.includes(userId))
        .map((m) => {
            const msg = m.toObject();

            const diff = Date.now() - new Date(msg.createdAt).getTime();
            msg.canDeleteForEveryone = diff <= 60 * 60 * 1000;

            if (m.deletedForEveryone) {
                msg.text = "";
                msg.deletedForEveryone = true;
                msg.canDeleteForEveryone = false;
            }

            return msg;
        });

    return res
        .status(200)
        .json(new ApiResponse(200, filtered, "Messages fetched"));
});

// ------------------ SEND MESSAGE ------------------
export const sendMessage = asyncHandler(async (req, res) => {
    const senderId = req.user._id;
    const { receiverId, conversationId, text } = req.body;

    if (!receiverId || !conversationId || !text) {
        throw new ApiError(400, "Missing fields for sending message");
    }

    await assertParticipant(conversationId, senderId);

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
    const { conversationId } = req.params;
    const userId = req.user._id;

    await assertParticipant(conversationId, userId);

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
    const userId = req.user._id;
    const { messageId } = req.body;

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
    const userId = req.user._id;
    const { messageId } = req.body;

    const msg = await Message.findById(messageId);
    if (!msg) throw new ApiError(404, "Message not found");

    await assertParticipant(msg.conversationId.toString(), userId);

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
    const userId = req.user._id;
    const { conversationId } = req.body;

    await assertParticipant(conversationId, userId);

    await Message.updateMany(
        { conversationId },
        { $addToSet: { deletedFor: userId } }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Chat deleted for user"));
});
