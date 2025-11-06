import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import themeReducer from "@/features/theme/themeSlice";
import profileReducer from "@/features/profile/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    profile: profileReducer,
  },
});
