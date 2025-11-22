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
        console.error("Failed to load messages", err);
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

  // Socket listeners
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
          lastMessage: msg,
        })
      );

      // Hide typing when message is received
      setTyping(false);
      clearTypingTimeout();
    };

    const handleTyping = (data) => {
      console.log("📝 Typing event received:", data);
      if (
        data.conversationId === conversationId &&
        data.userId !== currentUser._id
      ) {
        setTyping(true);
        clearTypingTimeout();

        typingTimeoutRef.current = setTimeout(() => {
          console.log("🕒 Auto-hiding typing indicator");
          setTyping(false);
        }, 3000);
      }
    };

    const handleStopTyping = (data) => {
      console.log("🛑 Stop typing event received:", data);
      if (
        data.conversationId === conversationId &&
        data.userId !== currentUser._id
      ) {
        setTyping(false);
        clearTypingTimeout();
      }
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
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
    console.log("📤 Sending typing event");
    socket.emit("typing", { conversationId, userId: currentUser._id });
  }, [conversationId, currentUser?._id]);

  const stopTyping = useCallback(() => {
    if (!conversationId || !currentUser?._id) return;
    console.log("📤 Sending stop typing event");
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


  return {
    messages,
    typing,
    loading,
    sendMessage,
    sendTyping,
    stopTyping,
    markRead,
    getSenderId,
  };
}
