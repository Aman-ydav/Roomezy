// src/features/chat/hooks/useChat.js
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { socket } from "@/socket/socket";
import { getMessages, sendMessageApi, markAsRead } from "@/utils/chatApi";
import {
  newMessageAlert,
  resetUnreadForConversation,
} from "@/features/chat/chatSlice";

export function useChat(conversationId, currentUser, partner) {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const typingTimeoutRef = useRef(null);

  // Clear typing timeout
  const clearTypingTimeout = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);

  const getSenderId = useCallback((msg) => {
    if (!msg) return null;
    if (msg.sender?._id) return msg.sender._id;
    if (msg.sender) return msg.sender;
    if (msg.senderId) return msg.senderId;
    return null;
  }, []);

  // Load messages + join room
  useEffect(() => {
    if (!conversationId || !currentUser?._id) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const res = await getMessages(conversationId);
        if (!cancelled) {
          setMessages(res.data.data || []);
        }
        await markAsRead(conversationId, currentUser._id);
        dispatch(resetUnreadForConversation(conversationId));
      } catch (err) {
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    socket.emit("join-conversation", conversationId);

    return () => {
      cancelled = true;
      socket.emit("leave-conversation", conversationId);
      clearTypingTimeout();
    };
  }, [conversationId, currentUser?._id, dispatch, clearTypingTimeout]);

  // Socket listeners (Messages + Typing + Deletion)
  useEffect(() => {
    if (!conversationId || !currentUser?._id) return;

    // ---------- RECEIVE MESSAGE ----------
    const handleReceiveMessage = (msg) => {
      if (msg.conversationId !== conversationId) return;

      if (String(msg.senderId) === String(currentUser._id)) return;

      const normalized = {
        ...msg,
        sender: msg.sender || msg.senderId,
        receiver: msg.receiver || msg.receiverId,
      };

      setMessages((prev) => [...prev, normalized]);

      dispatch(
        newMessageAlert({
          conversationId,
          from: msg.senderId,
          lastMessage: msg.text,
        })
      );

      setTyping(false);
      clearTypingTimeout();
    };

    // ---------- TYPING ----------
    const handleTyping = (data) => {
      if (
        data.conversationId === conversationId &&
        data.userId !== currentUser._id
      ) {
        setTyping(true);
        clearTypingTimeout();

        typingTimeoutRef.current = setTimeout(() => {
          setTyping(false);
        }, 3000);
      }
    };

    const handleStopTyping = (data) => {
      if (
        data.conversationId === conversationId &&
        data.userId !== currentUser._id
      ) {
        setTyping(false);
        clearTypingTimeout();
      }
    };

    const handleMessageDeletedForEveryone = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, text: "", deletedForEveryone: true }
            : msg
        )
      );
    };

    const handleMessageDeletedForMe = ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    };

    // ---------- REGISTER SOCKET EVENTS ----------
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

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      if (!partner?._id || !conversationId || !currentUser?._id) return;

      try {
        const res = await sendMessageApi({
          senderId: currentUser._id,
          receiverId: partner._id,
          conversationId,
          text: trimmed,
        });

        const saved = res.data.data;
        setMessages((prev) => [...prev, saved]);

        socket.emit("send-message", {
          conversationId,
          senderId: currentUser._id,
          receiverId: partner._id,
          text: trimmed,
        });

        await markAsRead(conversationId, currentUser._id);
      } catch (err) {
        console.error("Failed to send message", err);
      }
    },
    [conversationId, currentUser?._id, partner?._id]
  );

  // In useChat hook, enhance the markRead function
  const sendTyping = useCallback(() => {
    if (!conversationId || !currentUser?._id) return;
    socket.emit("typing", { conversationId, userId: currentUser._id });
  }, [conversationId, currentUser?._id]);

  const stopTyping = useCallback(() => {
    if (!conversationId || !currentUser?._id) return;
    socket.emit("stop-typing", { conversationId, userId: currentUser._id });
  }, [conversationId, currentUser?._id]);

  const markRead = useCallback(async () => {
    if (!conversationId || !currentUser?._id) return;
    try {
      await markAsRead(conversationId, currentUser._id);
      dispatch(resetUnreadForConversation(conversationId));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  }, [conversationId, currentUser?._id, dispatch]);

  const deleteForMe = async (message) => {
    socket.emit("delete-message-me", { messageId: message._id });

    setMessages((prev) => prev.filter((m) => m._id !== message._id));
  };

  const deleteForEveryone = async (message) => {
    socket.emit("delete-message-everyone", { messageId: message._id });

    setMessages((prev) =>
      prev.map((m) =>
        m._id === message._id ? { ...m, text: "", deletedForEveryone: true } : m
      )
    );
  };

  return {
    messages,
    typing,
    loading,
    sendMessage,
    sendTyping,
    stopTyping,
    markRead,
    getSenderId,
     deleteForMe,
  deleteForEveryone,
  };
}
