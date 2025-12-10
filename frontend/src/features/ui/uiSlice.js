// src/features/ui/uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    popup: null,
  },
  reducers: {
    showPopup(state, action) {
      state.popup = {
        senderName: action.payload.senderName,
        text: action.payload.text,
        url: action.payload.url,
        avatar: action.payload.avatar,
        conversationId: action.payload.conversationId,
      };
    },
    hidePopup(state) {
      state.popup = null;
    },
  },
});

export const { showPopup, hidePopup } = uiSlice.actions;

export default uiSlice.reducer;
