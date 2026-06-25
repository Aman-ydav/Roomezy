import { useState, useEffect } from "react";
import { socket } from "@/socket/socket";

export function useUserStatus(userId) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIsOnline(false);
      return;
    }

    // Always compare as strings — ObjectId vs string mismatch causes silent failures
    const uid = userId.toString();

    function requestStatus() {
      if (socket.connected) socket.emit("check-user-status", uid);
    }

    // Ask immediately (works if socket is already up)
    requestStatus();

    // Re-ask on reconnect (handles race where socket wasn't ready on mount)
    socket.on("connect", requestStatus);

    const handleUserOnline = (onlineUserId) => {
      if (onlineUserId?.toString() === uid) setIsOnline(true);
    };

    const handleUserOffline = (offlineUserId) => {
      if (offlineUserId?.toString() === uid) setIsOnline(false);
    };

    const handleUserStatus = ({ userId: respId, isOnline: online }) => {
      if (respId?.toString() === uid) setIsOnline(online);
    };

    socket.on("user-online",  handleUserOnline);
    socket.on("user-offline", handleUserOffline);
    socket.on("user-status",  handleUserStatus);

    return () => {
      socket.off("connect",      requestStatus);
      socket.off("user-online",  handleUserOnline);
      socket.off("user-offline", handleUserOffline);
      socket.off("user-status",  handleUserStatus);
    };
  }, [userId]);

  return isOnline;
}
