// src/utils/axiosInterceptor.js
import api from "./api";
import { store } from "@/app/store";
import { forceLogout } from "@/features/auth/authSlice";
import { toast } from "sonner";

console.log("Interceptor file loaded!");

// ✅ REQUEST INTERCEPTOR — attach Authorization header
api.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem("roomezy_tokens");
      if (raw) {
        const { accessToken } = JSON.parse(raw);
        if (accessToken) {
          config.headers = config.headers || {};
          // Only set if not already provided manually
          if (!config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        }
      }
    } catch (e) {
      console.warn("Failed to read tokens from localStorage", e);
    }

    // keep sending cookies too (for refresh, etc.)
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR — handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message?.toLowerCase() || "";

    console.log("Interceptor caught an error:", status, message);

    // You can either check message or just any 401
    if (status === 401) {
      store.dispatch(forceLogout());
      toast.info("Session expired. Please log in again.");
    }

    return Promise.reject(error);
  }
);

export default api;
