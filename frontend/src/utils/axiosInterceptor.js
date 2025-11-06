import api from "./api";
import { logoutUser } from "@/features/auth/authSlice";
import {store} from "@/app/store"; 

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired (401) and not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Call refresh-token route
        await api.post("/users/refresh-token", {}, { withCredentials: true });
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Session expired, please log in again.");
        store.dispatch(logoutUser());
      }
    }

    return Promise.reject(error);
  }
);

export default api;
