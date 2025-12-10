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

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  // When SW says "OPEN_CONVERSATION", go to /inbox and open that chat
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

  // Connect socket when user logged in
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
