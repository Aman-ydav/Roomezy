import api from "./api";
import { store } from "@/app/store";
import { forceLogout, setAccessToken } from "@/features/auth/authSlice";
import { toast } from "sonner";

// Paths that must never trigger a token refresh
const SKIP_REFRESH_PATHS = [
  "/users/login",
  "/users/google",
  "/users/refresh-token",
  "/users/forgot-password",
  "/users/reset-password",
  "/users/change-password",
  "/users/verify-email",
  "/users/register",
];

// ─── Singleton refresh promise ────────────────────────────────────────────────
// Guarantees only one /refresh-token HTTP request is in-flight at a time.
// All concurrent callers (401 retries, bootstrapAuth) share the same promise
// so they don't race and rotate the refresh token multiple times.
let refreshPromise = null;

export function getNewAccessToken() {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/users/refresh-token", {}, { withCredentials: true })
      .then((res) => {
        const token = res.data.data.accessToken;
        // Keep in-memory Redux state for socket.io handshake auth.
        // The httpOnly accessToken cookie (set by the backend) handles all HTTP auth.
        store.dispatch(setAccessToken(token));
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// ─── REQUEST INTERCEPTOR ─────────────────────────────────────────────────────
// The httpOnly accessToken cookie is sent automatically by the browser on every
// request — no Authorization header is required.  We still set it when the
// token is in Redux so that socket re-auth and any non-cookie path both work.
api.interceptors.request.use(
  (config) => {
    const { accessToken } = store.getState().auth;
    if (accessToken) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR ────────────────────────────────────────────────────
// Catches 401s (access token expired), refreshes once via the httpOnly
// refresh-token cookie, retries the original request.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 429) {
      toast("Too many requests. Please slow down a moment.", {
        description:
          "You've made too many requests in a short time. Wait a few seconds and try again.",
        style: {
          background: "#fff",
          color: "#6b7280",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        },
        duration: 4000,
      });
      return Promise.reject(error);
    }

    const isSkipped = SKIP_REFRESH_PATHS.some((p) =>
      original.url?.includes(p)
    );

    if (error.response?.status === 401 && !original._retry && !isSkipped) {
      original._retry = true;

      try {
        const token = await getNewAccessToken();
        // Set header so the retried request doesn't rely solely on the cookie
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        store.dispatch(forceLogout());
        toast.error("Session expired, please log in again.");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
