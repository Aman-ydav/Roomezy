// src/utils/interceptor.js
import api from "./api";
import { store } from "@/app/store";
import { forceLogout } from "@/features/auth/authSlice";
import { toast } from "sonner";

console.log("Interceptor file loaded!"); 

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("Interceptor caught an error:", error.response?.data);

    const message = error.response?.data?.message?.toLowerCase() || "";
    const status = error.response?.status;

    if (status === 401 && message.includes("invalid access token")) {
      store.dispatch(forceLogout());
      toast.error("Session expired. Please log in again.");
    }

    return Promise.reject(error);
  }
);

export default api;
