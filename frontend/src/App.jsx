// src/App.jsx
import React, { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { SonnerToaster } from "./components/ui/sonner-toaster";
import { useNavigate } from "react-router-dom";
import { setNavigator } from "./utils/navigateHelper";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "@/socket/socket.js";
import { setCurrentUserId } from "./features/chat/chatSlice";
import InAppMessagePopup from "@/components/ui/InAppMessagePopup";
import { hidePopup } from "@/features/ui/uiSlice";
import useChatSocket from "@/socket/useChatSocket";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const popup = useSelector((s) => s.ui.popup);

  useChatSocket();

  // For program navigation
  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  // Notification click → open chat
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "OPEN_CONVERSATION") {
          navigate("/inbox", {
            state: { openChatWith: event.data.conversationId },
          });
        }
      });
    }
  }, [navigate]);

  // Heartbeat
  useEffect(() => {
    if (!user?._id) return;
    const interval = setInterval(() => {
      socket.emit("heartbeat", user._id);
    }, 20000);
    return () => clearInterval(interval);
  }, [user]);

  // Sync visibility state to server for NO PUSH when visible
  useEffect(() => {
    if (!user?._id) return;

    const handleVisibility = () => {
      socket.emit("visibility", {
        userId: user._id,
        visible: document.visibilityState === "visible",
      });
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [user]);

  // Connect socket
  useEffect(() => {
    if (user?._id) {
      dispatch(setCurrentUserId(user._id));
      socket.connect();
      socket.emit("user-connected", user._id);
    }
    return () => {
      socket.disconnect();
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
