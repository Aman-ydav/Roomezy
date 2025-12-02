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

    // If access token expired → try refresh once
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const res = await api.post("/users/refresh-token", {}, {
          withCredentials: true
        });

        const { accessToken, refreshToken } = res.data.data;

        // Store new tokens
        localStorage.setItem(
          "roomezy_tokens",
          JSON.stringify({ accessToken, refreshToken })
        );

        // Retry original request
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);

      } catch (err) {
        store.dispatch(forceLogout());
        toast.error("Session expired, please log in again.");
      }
    }

    return Promise.reject(error);
  }
);


export default api;
