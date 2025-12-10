// src/socket/useChatSocket.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { newMessageAlert } from "@/features/chat/chatSlice";
import { showPopup } from "@/features/ui/uiSlice";
import useAppVisibility from "@/hooks/useAppVisibility";
import { socket } from "./socket";

export default function useChatSocket() {
  const dispatch = useDispatch();
  const isVisible = useAppVisibility();
  const currentChatId = useSelector((s) => s.chat.currentChatId);
  const currentUserId = useSelector((s) => s.chat.currentUserId);

  useEffect(() => {
    socket.on("receive-message", (msg) => {
      const {
        conversationId,
        senderId,
        text,
        senderName,
        senderAvatar,
        createdAt,
      } = msg;

      // Always update conversation list / unread
      dispatch(
        newMessageAlert({
          conversationId,
          from: senderId,
          lastMessage: text,
          lastMessageAt: createdAt || new Date().toISOString(),
        })
      );

      // Ignore my own messages
      if (senderId === currentUserId) return;

      // Case A: tab not visible → SW push will handle it
      if (!isVisible) return;

      // Case C: user already in that chat → no popup
      if (currentChatId === conversationId) return;

      // Case B: app visible & not in that chat → show in-app popup
      dispatch(
        showPopup({
          senderName: senderName || "New message",
          text,
          avatar: senderAvatar,
          url: "/inbox",
          conversationId,
        })
      );
    });

    return () => socket.off("receive-message");
  }, [currentChatId, currentUserId, isVisible, dispatch]);
}
