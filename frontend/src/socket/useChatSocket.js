// src/socket/useChatSocket.js
import { useEffect } from "react";
import { socket } from "./socket";
import { store } from "@/app/store";
import { newMessageAlert } from "@/features/chat/chatSlice";
import { showPopup } from "@/features/ui/uiSlice";

/**
 * Global socket handler that:
 * - Always updates conversations state when a message arrives (newMessageAlert).
 * - Shows in-app popup only when appropriate:
 *   - Document is visible
 *   - The user is NOT currently viewing the conversation
 *   - The message is not from currentUser
 *
 * NOTE: We read current state from store.getState() inside the handler so the
 * handler always has up-to-date values (no stale closures).
 */
export default function useChatSocket() {
  useEffect(() => {
    if (!socket) return;

    const handler = async (msg) => {
      try {
        const {
          conversationId,
          senderId,
          text,
          senderName,
          senderAvatar,
          createdAt,
        } = msg || {};

        // Always update conversation list / unread counts
        store.dispatch(
          newMessageAlert({
            conversationId,
            from: senderId,
            lastMessage: text,
            lastMessageAt: createdAt || new Date().toISOString(),
          })
        );

        const state = store.getState();
        const currentUserId = state.chat?.currentUserId;
        const currentChatId = state.chat?.currentChatId;

        if (!senderId || String(senderId) === String(currentUserId)) return;

        // 100ms debounce — visibilityState may not have settled on tab switch
        await new Promise((r) => setTimeout(r, 100));

        if (document.visibilityState !== "visible") return;

        if (currentChatId && String(currentChatId) === String(conversationId)) return;

        store.dispatch(
          showPopup({
            senderName: senderName || "New Message",
            text: text || "",
            avatar: senderAvatar || null,
            url: `/inbox`,
            conversationId,
          })
        );
      } catch (err) {
        console.error("[useChatSocket] receive-message handler error", err);
      }
    };

    socket.on("receive-message", handler);

    return () => {
      socket.off("receive-message", handler);
    };
  }, []);
}
