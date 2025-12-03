import api from "./api";
import { store } from "@/app/store";
import { forceLogout } from "@/features/auth/authSlice";
import { toast } from "sonner";

console.log("Interceptor file loaded!");

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // Read tokens from localStorage
    try {
      const raw = localStorage.getItem("roomezy_tokens");
      if (raw) {
        const { accessToken } = JSON.parse(raw);
        if (accessToken) {
          config.headers = config.headers || {};
          if (!config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        }
      }
    } catch (e) {
      console.warn("Failed to read tokens from localStorage", e);
    }

    config.withCredentials = true; // keep sending cookies
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Do NOT refresh token on login, google login, or refresh-token itself
    const blockedUrls = [
      "/users/login",
      "/users/google",
      "/users/refresh-token",
      "/users/forgot-password",
      "/users/reset-password",
      "/users/change-password",
      "/users/verify-email",
    ];

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !blockedUrls.some((u) => original.url.includes(u))
    ) {
      original._retry = true;

      try {
        const raw = localStorage.getItem("roomezy_tokens");
        const storedRefreshToken = raw ? JSON.parse(raw)?.refreshToken : null;

        const res = await api.post(
          "/users/refresh-token",
          { refreshToken: storedRefreshToken },
          { withCredentials: true }
        );

        const { accessToken, refreshToken } = res.data.data;

        // Save new tokens
        localStorage.setItem(
          "roomezy_tokens",
          JSON.stringify({ accessToken, refreshToken })
        );

        // Retry request with new access token
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (err) {
        // If refresh failed — force logout
        store.dispatch(forceLogout());
        toast.error("Session expired, please log in again.");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
