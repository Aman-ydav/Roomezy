// src/App.jsx
import React, { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { SonnerToaster } from "./components/ui/sonner-toaster";
import InstallPWAPopup from "@/components/ui/InstallPWAPopup";
import { useNavigate } from "react-router-dom";
import { setNavigator } from "./utils/navigateHelper";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "@/socket/socket.js";
import { setCurrentUserId } from "@/features/chat/chatSlice";
import InAppMessagePopup from "@/components/ui/InAppMessagePopup";
import { hidePopup } from "@/features/ui/uiSlice";
import useChatSocket from "@/socket/useChatSocket";


function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const popup = useSelector((s) => s.ui.popup);

  useChatSocket();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const onSWMessage = (event) => {
        if (event.data?.type === "OPEN_CONVERSATION") {
          navigate("/inbox", {
            state: { openChatWith: event.data.conversationId },
          });
        }
      };
      navigator.serviceWorker.addEventListener("message", onSWMessage);
      return () =>
        navigator.serviceWorker.removeEventListener("message", onSWMessage);
    }
  }, [navigate]);

  useEffect(() => {
    if (!user?._id) return;

    const interval = setInterval(() => {
      try {
        socket.emit("heartbeat", user._id);
      } catch (err) {
      }
    }, 20000); // every 20s

    return () => clearInterval(interval);
  }, [user]);

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

        <InstallPWAPopup />
      <SonnerToaster />
      <AppRouter />
    </>
  );
}

export default App;
