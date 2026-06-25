import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    popupQueue: [],
  },
  reducers: {
    showPopup(state, action) {
      state.popupQueue.push({
        senderName: action.payload.senderName,
        text: action.payload.text,
        url: action.payload.url,
        avatar: action.payload.avatar,
        conversationId: action.payload.conversationId,
      });
    },
    hidePopup(state) {
      state.popupQueue.shift();
    },
  },
});

export const { showPopup, hidePopup } = uiSlice.actions;
export default uiSlice.reducer;
