// src/features/chat/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    currentUserId: null,
  },
  reducers: {
    setCurrentUserId(state, action) {
      state.currentUserId = action.payload;
    },

    setConversations(state, action) {
      const conversations = action.payload || [];
      state.conversations = conversations.map((c) => ({
        ...c,
        unreadCount: c.unreadCount || {},
      }));
    },

    updateConversation(state, action) {
      const updated = action.payload;
      const idx = state.conversations.findIndex((c) => c._id === updated._id);

      if (idx !== -1) {
        state.conversations[idx] = {
          ...state.conversations[idx],
          ...updated,
        };
      } else {
        state.conversations.unshift(updated);
      }
    },

    resetUnreadForConversation(state, action) {
      const conversationId = action.payload;
      const convo = state.conversations.find((c) => c._id === conversationId);
      if (!convo || !state.currentUserId) return;
      convo.unreadCount[state.currentUserId] = 0;
    },

    newMessageAlert(state, action) {
      const { conversationId, from, lastMessage, lastMessageAt } = action.payload;

      let existing = state.conversations.find((c) => c._id === conversationId);

      const convo = {
        ...(existing || {}),
        _id: conversationId,
        participants: existing?.participants || [],
        lastMessage,
        lastMessageAt: lastMessageAt || new Date().toISOString(),
        lastMessageSender: from,
        updatedAt: lastMessageAt || new Date().toISOString(),

        unreadCount: {
          ...(existing?.unreadCount || {}),
        },
      };

      // increase unread if message NOT by me
      if (state.currentUserId && from !== state.currentUserId) {
        convo.unreadCount[state.currentUserId] =
          (convo.unreadCount[state.currentUserId] || 0) + 1;
      }

      state.conversations = [
        convo,
        ...state.conversations.filter((c) => c._id !== conversationId),
      ];
    },
  },
});

export const {
  setCurrentUserId,
  setConversations,
  updateConversation,
  resetUnreadForConversation,
  newMessageAlert,
} = chatSlice.actions;

export default chatSlice.reducer;
