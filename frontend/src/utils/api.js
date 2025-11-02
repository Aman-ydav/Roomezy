import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1/",
  withCredentials: true, // allow JWT cookies
});

export default api;
