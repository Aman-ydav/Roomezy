import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import themeReducer from "@/features/theme/themeSlice";
import profileReducer from "@/features/profile/profileSlice";
import postReducer from "@/features/post/postSlice";
import chatReducer from "@/features/chat/chatSlice";
import savedPostsReducer from "@/features/savedPosts/savedPostSlice";
import mediaReducer from "@/features/media/mediaSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    profile: profileReducer,
    post: postReducer,
    chat: chatReducer,
    savedPosts: savedPostsReducer, 
    media: mediaReducer,
  },
});
