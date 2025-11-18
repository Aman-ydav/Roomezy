import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOrGetConversation = asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    throw new ApiError(400, "senderId and receiverId required");
  }

  if (String(senderId) === String(receiverId)) {
    throw new ApiError(400, "You cannot start a chat with yourself");
  }

  // Try to find existing conversation between two participants (any order)
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  }).populate("participants", "userName avatar createdAt");

  // Create new conversation if not exist
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

    // populate after creating
    conversation = await Conversation.findById(conversation._id).populate(
      "participants",
      "userName avatar createdAt"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, conversation, "Conversation fetched/created"));
});

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

export const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  if (!conversationId) throw new ApiError(400, "conversationId required");

  const messages = await Message.find({ conversationId }).sort({
    createdAt: 1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages fetched"));
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { senderId, receiverId, conversationId, text } = req.body;

  if (!senderId || !receiverId || !conversationId || !text) {
    throw new ApiError(400, "Missing fields for sending message");
  }

  if (String(senderId) === String(receiverId)) {
    throw new ApiError(400, "You cannot send message to yourself");
  }

  // Store message
  const message = await Message.create({
    sender: senderId,
    receiver: receiverId,
    conversationId,
    text,
  });

  // Update conversation preview + unread count
  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: text, // string, NOT object
    lastMessageSender: senderId,
    $inc: { [`unreadCount.${receiverId}`]: 1 },
    updatedAt: new Date(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, message, "Message sent successfully"));
});

export const markMessagesAsRead = asyncHandler(async (req, res) => {
  const { conversationId, userId } = req.params;

  if (!conversationId || !userId)
    throw new ApiError(400, "conversationId and userId required");

  // Update all unread messages
  await Message.updateMany(
    {
      conversationId,
      receiver: userId,
      read: false,
    },
    { read: true }
  );

  // Reset unread counter for this user
  await Conversation.findByIdAndUpdate(conversationId, {
    [`unreadCount.${userId}`]: 0,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Messages marked as read"));
});
