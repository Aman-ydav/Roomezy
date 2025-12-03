// src/features/chat/chatSlice.js - UPDATED
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
      // Make sure conversations have proper unreadCount structure
      const conversations = action.payload || [];
      state.conversations = conversations.map((convo) => ({
        ...convo,
        unreadCount: convo.unreadCount || {},
      }));
    },

    updateConversation(state, action) {
      const updated = action.payload;
      const idx = state.conversations.findIndex((c) => c._id === updated._id);
      if (idx >= 0) {
        state.conversations[idx] = updated;
      } else {
        state.conversations.unshift(updated);
      }
    },

    // Reset unread for conversation
    resetUnreadForConversation(state, action) {
      const conversationId = action.payload;
      const convo = state.conversations.find((c) => c._id === conversationId);
      if (!convo || !state.currentUserId) return;

      // Reset to 0
      convo.unreadCount[state.currentUserId] = 0;
    },

    newMessageAlert(state, action) {
      const { conversationId, from, lastMessage, lastMessageAt } =
        action.payload;

      const now = lastMessageAt || new Date().toISOString();

      let existing = state.conversations.find((c) => c._id === conversationId);

      let convo = {
        ...(existing || {}), // <--- KEEP participants + all data
        _id: conversationId,
        participants: existing?.participants || [], // <--- FIX
        lastMessage,
        lastMessageSender: from,
        lastMessageAt: now,
        updatedAt: now,
        unreadCount: {
          ...(existing?.unreadCount || {}),
        },
      };

      // increment unread
      if (state.currentUserId && from !== state.currentUserId) {
        convo.unreadCount[state.currentUserId] =
          (convo.unreadCount[state.currentUserId] || 0) + 1;
      }

      // Replace conversations state
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
