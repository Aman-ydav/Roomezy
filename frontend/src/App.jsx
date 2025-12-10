// src/App.jsx
import React, { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { SonnerToaster } from "./components/ui/sonner-toaster";
import { useNavigate } from "react-router-dom";
import { setNavigator } from "./utils/navigateHelper";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "@/socket/socket.js";
import { setCurrentUserId } from "@/features/chat/chatSlice";
import InAppMessagePopup from "@/components/ui/InAppMessagePopup";
import { hidePopup } from "@/features/ui/uiSlice";
import useChatSocket from "@/socket/useChatSocket";

/**
 * App root
 * - mounts the global socket listener (useChatSocket)
 * - handles messages from service worker (OPEN_CONVERSATION)
 * - sends heartbeat pings to server so server keeps user online
 */
function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const popup = useSelector((s) => s.ui.popup);

  // Mount global socket handlers (conversation list updates + popups)
  useChatSocket();

  // Navigator helper (if you use programmatic navigation elsewhere)
  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  // Handle messages from Service Worker (click on system notification)
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const onSWMessage = (event) => {
        if (event.data?.type === "OPEN_CONVERSATION") {
          navigate("/inbox", {
            state: { openChatWith: event.data.conversationId },
          });
        }
        // Service worker may also request visibility state; ignored here
      };
      navigator.serviceWorker.addEventListener("message", onSWMessage);
      return () =>
        navigator.serviceWorker.removeEventListener("message", onSWMessage);
    }
  }, [navigate]);

  // Heartbeat: keep server aware that user is active (prevents false offline)
  useEffect(() => {
    if (!user?._id) return;

    const interval = setInterval(() => {
      try {
        socket.emit("heartbeat", user._id);
      } catch (err) {
        // ignore if socket not connected
      }
    }, 20000); // every 20s

    return () => clearInterval(interval);
  }, [user]);

  // Connect socket when user logs in
  useEffect(() => {
    if (user?._id) {
      dispatch(setCurrentUserId(user._id));
      socket.connect();
      socket.emit("user-connected", user._id);
    }

    return () => {
      try {
        socket.disconnect();
      } catch (e) {
        // ignore
      }
    };
  }, [user, dispatch]);

  return (
    <>
      {popup && (
        <InAppMessagePopup
          senderName={popup.senderName}
          text={popup.text}
          url={popup.url}
          avatar={popup.avatar}
          conversationId={popup.conversationId}
          onClose={() => dispatch(hidePopup())}
        />
      )}
      <SonnerToaster />
      <AppRouter />
    </>
  );
}

export default App;
