import { useEffect, useState, useCallback } from "react";
import { socket } from "../socket/socket";
import { getMessages, sendMessageApi, markAsRead } from "@/utils/chatApi";

export function useChat(conversationId, user, receiver) {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  // Fetch chat messages
  useEffect(() => {
    if (!conversationId) return;

    getMessages(conversationId).then((res) => {
      setMessages(res.data.data);
    });

    // Join conversation room in REALTIME
    socket.emit("join-conversation", conversationId);
  }, [conversationId]);

  // Listen for new messages
  useEffect(() => {
    socket.on("receive-message", (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on("typing", ({ userId }) => {
      if (userId === receiver?._id) setTyping(true);
    });

    socket.on("stop-typing", ({ userId }) => {
      if (userId === receiver?._id) setTyping(false);
    });

    return () => {
      socket.off("receive-message");
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [conversationId, receiver]);

  // SEND MESSAGE
  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim()) return;

      const { data } = await sendMessageApi({
        senderId: user._id,
        receiverId: receiver._id,
        conversationId,
        text,
      });

      // Emit in real-time
      socket.emit("send-message", {
        conversationId,
        senderId: user._id,
        receiverId: receiver._id,
        text,
      });

      // ❌ REMOVE THIS
      // setMessages((prev) => [...prev, data.data]);
    },
    [conversationId, user, receiver]
  );

  // TYPING HANDLER
  const sendTyping = () => {
    socket.emit("typing", { conversationId, userId: user._id });
  };

  const stopTyping = () => {
    socket.emit("stop-typing", { conversationId, userId: user._id });
  };

  // MARK AS READ when chat opens
  const markRead = useCallback(() => {
    markAsRead(conversationId, user._id);
  }, [conversationId, user]);

  return {
    messages,
    sendMessage,
    typing,
    sendTyping,
    stopTyping,
    markRead,
  };
}
