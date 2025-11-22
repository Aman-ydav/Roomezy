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
      state.conversations = conversations.map(convo => ({
        ...convo,
        unreadCount: convo.unreadCount || {}
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

    // SOCKET ALERT FOR SIDE LIST
    newMessageAlert(state, action) {
      const { conversationId, from, lastMessage } = action.payload;
      
      // Find conversation
      let convo = state.conversations.find((c) => c._id === conversationId);
      
      if (!convo) {
        // If conversation doesn't exist, create a basic one
        convo = {
          _id: conversationId,
          participants: [],
          lastMessage: lastMessage,
          lastMessageSender: from,
          unreadCount: {}
        };
        state.conversations.unshift(convo);
      } else {
        // Update existing conversation
        convo.lastMessage = lastMessage;
        convo.lastMessageSender = from;
        
        // Move to top
        state.conversations = [
          convo,
          ...state.conversations.filter((x) => x._id !== conversationId),
        ];
      }

      // Initialize unreadCount if it doesn't exist
      if (!convo.unreadCount) convo.unreadCount = {};

      // Increment unread only if message is from someone else
      if (state.currentUserId && from !== state.currentUserId) {
        convo.unreadCount[state.currentUserId] = 
          (convo.unreadCount[state.currentUserId] || 0) + 1;
      }
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