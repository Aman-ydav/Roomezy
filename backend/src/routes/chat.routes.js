import express from "express";
import {
  createOrGetConversation,
  getUserConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from "../controllers/chat.controllers.js";

const router = express.Router();

// Create OR Get an existing conversation
router.post("/conversation", createOrGetConversation);

// Get conversations for a user
router.get("/conversations/:userId", getUserConversations);

// Get messages for a conversation
router.get("/messages/:conversationId", getMessages);

// Send a message
router.post("/message", sendMessage);

// Mark messages as read
router.patch("/read/:conversationId/:userId", markMessagesAsRead);

export default router;
