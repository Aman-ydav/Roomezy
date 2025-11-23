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
    const status = error.response?.status;

    console.log("Interceptor caught an error:", status);


    // simple behaviour: if 401 => force logout
    if (status === 401 && !error.response?.data?.message=="Old password is incorrect") {
      store.dispatch(forceLogout());
      toast.info("Session expired. Please log in again.");
    }

    return Promise.reject(error);
  }
);

export default api;
