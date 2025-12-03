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
} from "../controllers/chat.controllers.js";

const router = express.Router();

router.post("/conversation", createOrGetConversation);

router.get("/conversations/:userId", getUserConversations);

router.get("/messages/:conversationId", getMessages);

router.post("/message", sendMessage);


router.patch("/read/:conversationId/:userId", markMessagesAsRead);

router.patch("/message/delete-everyone", deleteMessageForEveryone);

router.patch("/message/delete-me", deleteMessageForMe);

router.patch("/conversation/delete-me", deleteChatForMe);

export default router;
