import { useEffect, useState, useCallback } from "react";
import { socket } from "../socket/socket";
import { getMessages, sendMessageApi, markAsRead } from "@/utils/chatApi";

export function useChat(conversationId, currentUser, partner) {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  // helper: normalize sender id for alignment
  const getSenderId = (msg) => {
    if (!msg) return null;
    if (msg.sender?._id) return msg.sender._id;
    if (msg.sender) return msg.sender;
    if (msg.senderId) return msg.senderId;
    return null;
  };

  // 1) Load messages + join room
  useEffect(() => {
    if (!conversationId || !currentUser) return;

    (async () => {
      const res = await getMessages(conversationId);
      setMessages(res.data.data || []);
    })();

    socket.emit("join-conversation", conversationId);

    return () => {
      socket.emit("leave-conversation", conversationId);
    };
  }, [conversationId, currentUser]);

  // 2) Socket listeners: new messages + typing
  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      if (msg.conversationId !== conversationId) return;

      //  Prevent double message for sender
      if (String(msg.senderId) === String(currentUser._id)) return;

      const normalized = {
        ...msg,
        sender: msg.sender || msg.senderId,
        receiver: msg.receiver || msg.receiverId,
      };

      setMessages((prev) => [...prev, normalized]);
    };

    const handleTyping = ({ conversationId: cid, userId }) => {
      if (cid === conversationId && userId === partner?._id) {
        setTyping(true);
      }
    };

    const handleStopTyping = ({ conversationId: cid, userId }) => {
      if (cid === conversationId && userId === partner?._id) {
        setTyping(false);
      }
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, [conversationId, partner]);

  // 3) Send message
  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim()) return;
      if (!partner?._id || !conversationId || !currentUser?._id) {
        console.warn("Missing fields, cannot send message yet.");
        return;
      }

      // Save in DB
      const res = await sendMessageApi({
        senderId: currentUser._id,
        receiverId: partner._id,
        conversationId,
        text,
      });

      const saved = res.data.data;

      setMessages((prev) => [...prev, saved]);

      // Emit real-time event for receiver
      socket.emit("send-message", {
        conversationId,
        senderId: currentUser._id,
        receiverId: partner._id,
        text,
      });
    },
    [conversationId, currentUser, partner]
  );

  // 4) Typing indicator
  const sendTyping = () => {
    if (!conversationId || !currentUser) return;
    socket.emit("typing", { conversationId, userId: currentUser._id });
  };

  const stopTyping = () => {
    if (!conversationId || !currentUser) return;
    socket.emit("stop-typing", { conversationId, userId: currentUser._id });
  };

  // 5) Mark as read
  const markRead = useCallback(() => {
    if (!conversationId || !currentUser) return;
    markAsRead(conversationId, currentUser._id);
  }, [conversationId, currentUser]);

  return {
    messages,
    typing,
    sendMessage,
    sendTyping,
    stopTyping,
    markRead,
    getSenderId, // so UI can decide left/right
  };
}
