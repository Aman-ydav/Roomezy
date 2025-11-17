import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],   // inbox list
  },
  reducers: {
    setConversations(state, action) {
      state.conversations = action.payload;
    },

    newMessageAlert(state, action) {
      const { conversationId, from } = action.payload;

      const convo = state.conversations.find(
        (c) => c._id === conversationId
      );

      if (convo) {
        // update last message preview
        convo.lastMessageSender = from;
        convo.unreadCount[from] =
          (convo.unreadCount[from] || 0) + 1;

        // move to top
        state.conversations = [
          convo,
          ...state.conversations.filter((x) => x._id !== convo._id)
        ];
      }
    },
  },
});

export const { setConversations, newMessageAlert } = chatSlice.actions;
export default chatSlice.reducer;
