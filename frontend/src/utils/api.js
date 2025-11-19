import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1/",
  withCredentials: true, // cookies/JWT
   headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Fallback for iOS
    },
});

axios.defaults.withCredentials = true;

export default api;