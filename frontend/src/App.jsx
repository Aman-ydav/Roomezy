import React, { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { SonnerToaster } from "./components/ui/sonner-toaster";
import { useNavigate } from "react-router-dom";
import { setNavigator } from "./utils/navigateHelper";
import { useSelector } from "react-redux";
import { socket } from "@/socket/socket.js";
import { store } from "./app/store";

function App() {
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?._id) {
      socket.connect();
      socket.emit("user-connected", user._id);
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!user?._id) return;

    socket.on("new-message-alert", (data) => {
      // This tells the inbox a message came
      store.dispatch({
        type: "chat/newMessageAlert",
        payload: data,
      });
    });

    return () => {
      socket.off("new-message-alert");
    };
  }, [user]);

  const navigate = useNavigate();
  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return (
    <>
      <SonnerToaster />
      <AppRouter />
    </>
  );
}

export default App;
