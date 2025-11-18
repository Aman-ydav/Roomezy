import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1/",
  withCredentials: true, // cookies/JWT
});

api.defaults.headers.common["Content-Type"] = "application/json";
api.defaults.withCredentials = true;

axios.defaults.withCredentials = true;

export default api;
