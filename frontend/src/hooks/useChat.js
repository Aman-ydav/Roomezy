// src/hooks/useChat.js
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { socket } from "@/socket/socket";
import {
  getMessages,
  sendMessageApi,
  markAsRead,
  deleteMessageForMeApi,
  deleteMessageForEveryoneApi,
} from "@/utils/chatApi";
import { newMessageAlert, resetUnreadForConversation } from "@/features/chat/chatSlice";

/**
 * useChat - manages messages for a single conversation
 *
 * Ensures:
 * - join / leave room
 * - listens to 'receive-message' only for this conversation
 * - keeps messages state in sync
 */
export function useChat(conversationId, currentUser, partner) {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const typingTimeoutRef = useRef(null);

  const clearTypingTimeout = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);

  const getSenderId = useCallback((msg) => {
    if (!msg) return null;
    return msg.sender?._id || msg.sender || msg.senderId;
  }, []);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (!conversationId || !currentUser?._id) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const res = await getMessages(conversationId);
        if (!cancelled) setMessages(res.data.data || []);
        // mark read on open
        await markAsRead(conversationId, currentUser._id);
        dispatch(resetUnreadForConversation(conversationId));
      } catch (err) {
        console.error("useChat getMessages error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    // Join room for typing events / server side room based emits
    try {
      socket.emit("join-conversation", conversationId);
    } catch (err) {
      // ignore if socket not connected
    }

    return () => {
      cancelled = true;
      try {
        socket.emit("leave-conversation", conversationId);
      } catch (err) {}
      clearTypingTimeout();
    };
  }, [conversationId, currentUser?._id, dispatch, clearTypingTimeout]);

  // Socket listeners scoped to this conversation
  useEffect(() => {
    if (!conversationId || !currentUser?._id) return;

    const handleReceiveMessage = (msg) => {
      // Only handle messages for this conversation
      if (String(msg.conversationId) !== String(conversationId)) return;

      // Ignore messages sent by me (server may forward back)
      if (String(msg.senderId) === String(currentUser._id)) return;

      const normalized = {
        ...msg,
        sender: msg.sender || msg.senderId,
        receiver: msg.receiver || msg.receiverId,
      };

      setMessages((prev) => [...prev, normalized]);

      // Update unread counter in list too (safe)
      dispatch(
        newMessageAlert({
          conversationId,
          from: msg.senderId,
          lastMessage: msg.text,
          lastMessageAt: msg.createdAt || new Date().toISOString(),
        })
      );
    };

    const handleTyping = (data) => {
      if (String(data.conversationId) !== String(conversationId)) return;
      if (String(data.userId) === String(currentUser._id)) return;

      setTyping(true);
      clearTypingTimeout();
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false);
      }, 3000);
    };

    const handleStopTyping = (data) => {
      if (String(data.conversationId) !== String(conversationId)) return;
      if (String(data.userId) === String(currentUser._id)) return;
      setTyping(false);
      clearTypingTimeout();
    };

    const handleMessageDeletedForEveryone = ({ messageId, conversationId: conv }) => {
      if (String(conv) !== String(conversationId)) return;
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, text: "", deletedForEveryone: true } : m
        )
      );
    };

    const handleMessageDeletedForMe = ({ messageId, conversationId: conv }) => {
      if (String(conv) !== String(conversationId)) return;
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);
    socket.on("message-deleted-everyone", handleMessageDeletedForEveryone);
    socket.on("message-deleted-me", handleMessageDeletedForMe);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
      socket.off("message-deleted-everyone", handleMessageDeletedForEveryone);
      socket.off("message-deleted-me", handleMessageDeletedForMe);
      clearTypingTimeout();
    };
  }, [conversationId, currentUser?._id, dispatch, clearTypingTimeout]);

  // Send message
  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || "").trim();
      if (!trimmed) return;

      try {
        const res = await sendMessageApi({
          senderId: currentUser._id,
          receiverId: partner._id,
          conversationId,
          text: trimmed,
        });

        const saved = res.data.data;
        setMessages((prev) => [...prev, saved]);

        // Emit to server so other clients get it
        try {
          socket.emit("send-message", {
            conversationId,
            senderId: currentUser._id,
            receiverId: partner._id,
            text: trimmed,
          });
        } catch (err) {
          // ignore
        }

        // Mark read after sending
        await markAsRead(conversationId, currentUser._id);
      } catch (err) {
        console.error("useChat sendMessage error:", err);
      }
    },
    [conversationId, currentUser?._id, partner?._id]
  );

  // Delete for me
  const deleteForMe = async (message) => {
    try {
      await deleteMessageForMeApi({
        messageId: message._id,
        userId: currentUser._id,
        conversationId,
      });
      socket.emit("delete-message-me", {
        messageId: message._id,
        userId: currentUser._id,
        conversationId,
      });
      setMessages((prev) => prev.filter((m) => m._id !== message._id));
    } catch (err) {
      console.error("deleteForMe error", err);
    }
  };

  // Delete for everyone
  const deleteForEveryone = async (message) => {
    try {
      await deleteMessageForEveryoneApi({
        messageId: message._id,
        userId: currentUser._id,
        conversationId,
      });
      socket.emit("delete-message-everyone", {
        messageId: message._id,
        conversationId,
      });
      setMessages((prev) =>
        prev.map((m) =>
          m._id === message._id ? { ...m, text: "", deletedForEveryone: true } : m
        )
      );
    } catch (err) {
      console.error("deleteForEveryone error", err);
    }
  };

  return {
    messages,
    typing,
    loading,
    sendMessage,
    sendTyping: () =>
      socket.emit("typing", { conversationId, userId: currentUser._id }),
    stopTyping: () =>
      socket.emit("stop-typing", { conversationId, userId: currentUser._id }),
    markRead: async () => {
      try {
        await markAsRead(conversationId, currentUser._id);
        dispatch(resetUnreadForConversation(conversationId));
      } catch (err) {
        console.error("markRead error", err);
      }
    },
    getSenderId,
    deleteForMe,
    deleteForEveryone,
  };
}
