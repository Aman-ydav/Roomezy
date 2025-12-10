// src/socket/useChatSocket.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { newMessageAlert } from "@/features/chat/chatSlice";
import { showPopup } from "@/features/ui/uiSlice";
import useAppVisibility from "@/hooks/useAppVisibility";
import { socket } from "./socket";

export default function useChatSocket() {
  const dispatch = useDispatch();
  const visible = useAppVisibility();
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

      // update list
      dispatch(newMessageAlert({
        conversationId,
        from: senderId,
        lastMessage: text,
        lastMessageAt: createdAt || new Date().toISOString(),
      }));

      // my own message
      if (senderId === currentUserId) return;

      // tab not visible → SW push
      if (!visible) return;

      // chat open → no popup
      if (currentChatId === conversationId) return;

      // show popup
      dispatch(showPopup({
        senderName,
        text,
        conversationId,
        avatar: senderAvatar,
        url: "/inbox",
      }));
    });

    return () => socket.off("receive-message");
  }, [visible, currentChatId, currentUserId, dispatch]);
}
