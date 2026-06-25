import express from "express";
import {
    createOrGetConversation,
    getUserConversations,
    getMessages,
    sendMessage,
    markMessagesAsRead,
    deleteMessageForEveryone,
    deleteMessageForMe,
    deleteChatForMe,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All chat routes require authentication
router.post("/conversation", verifyJWT, createOrGetConversation);

router.get("/conversations", verifyJWT, getUserConversations);

router.get("/messages/:conversationId", verifyJWT, getMessages);

router.post("/message", verifyJWT, sendMessage);

router.patch("/read/:conversationId", verifyJWT, markMessagesAsRead);

router.patch("/message/delete-everyone", verifyJWT, deleteMessageForEveryone);

router.patch("/message/delete-me", verifyJWT, deleteMessageForMe);

router.patch("/conversation/delete-me", verifyJWT, deleteChatForMe);

export default router;
