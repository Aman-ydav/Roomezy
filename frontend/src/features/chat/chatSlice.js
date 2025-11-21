import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
  },
  reducers: {
    setConversations(state, action) {
      state.conversations = action.payload;
    },

    newMessageAlert(state, action) {
      const { conversationId, from, lastMessage } = action.payload;

      const convo = state.conversations.find((c) => c._id === conversationId);

      if (convo) {
        convo.lastMessage = lastMessage;
        convo.lastMessageSender = from;

        // Not for sender
        if (from !== state.currentUserId) {
          convo.unreadCount = {
            ...convo.unreadCount,
            [state.currentUserId]:
              (convo.unreadCount[state.currentUserId] || 0) + 1,
          };
        }

        // Move conversation to top
        state.conversations = [
          convo,
          ...state.conversations.filter((x) => x._id !== conversationId),
        ];
      }
    },
  },
});

export const { setConversations, newMessageAlert } = chatSlice.actions;
export default chatSlice.reducer;
