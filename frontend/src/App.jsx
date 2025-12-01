import React, { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { SonnerToaster } from "./components/ui/sonner-toaster";
import { useNavigate } from "react-router-dom";
import { setNavigator } from "./utils/navigateHelper";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "@/socket/socket.js";
import { setCurrentUserId } from "./features/chat/chatSlice";
import { store } from "./app/store";

function App() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) {
      // Set currentUserId in Redux for unread logic
      dispatch(setCurrentUserId(user._id));
      
      socket.connect();
      socket.emit("user-connected", user._id);
    }

    return () => {
      socket.disconnect();
    };
  }, [user, dispatch]);


  useEffect(() => {
    if (!user?._id) return;

    socket.on("new-message-alert", (data) => {
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