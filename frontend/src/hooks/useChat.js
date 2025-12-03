import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { socket } from "@/socket/socket";
import {
  getMessages,
  sendMessageApi,
  markAsRead,
} from "@/utils/chatApi";

import {
  deleteMessageForMeApi,
  deleteMessageForEveryoneApi,
} from "@/utils/chatApi";

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

  // ------------------ FETCH MESSAGES ------------------
  useEffect(() => {
    if (!conversationId || !currentUser?._id) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const res = await getMessages(conversationId);
        if (!cancelled) setMessages(res.data.data || []);
        await markAsRead(conversationId, currentUser._id);
        dispatch(resetUnreadForConversation(conversationId));
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

  // ------------------ SOCKET LISTENERS ------------------
  useEffect(() => {
    if (!conversationId || !currentUser?._id) return;

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
    };

    const handleTyping = (data) => {
      if (data.conversationId !== conversationId) return;
      if (data.userId === currentUser._id) return;

      setTyping(true);
      clearTypingTimeout();

      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false);
      }, 3000);
    };

    const handleStopTyping = (data) => {
      if (data.conversationId !== conversationId) return;
      if (data.userId === currentUser._id) return;

      setTyping(false);
      clearTypingTimeout();
    };

    const handleMessageDeletedForEveryone = ({ messageId, conversationId: conv }) => {
      if (conv !== conversationId) return;

      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, text: "", deletedForEveryone: true } : m
        )
      );
    };

    const handleMessageDeletedForMe = ({ messageId, conversationId: conv }) => {
      if (conv !== conversationId) return;

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

  // ------------------ SEND MESSAGE ------------------
  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;

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
    },
    [conversationId, currentUser?._id, partner?._id]
  );

  // ------------------ DELETE FOR ME ------------------
  const deleteForMe = async (message) => {
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
  };

  // ------------------ DELETE FOR EVERYONE ------------------
  const deleteForEveryone = async (message) => {
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
      await markAsRead(conversationId, currentUser._id);
      dispatch(resetUnreadForConversation(conversationId));
    },
    getSenderId,
    deleteForMe,
    deleteForEveryone,
  };
}
