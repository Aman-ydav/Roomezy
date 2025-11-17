import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("SOCKET CONNECTED:", socket.id);
  window.socketStatus = "CONNECTED";
});

socket.on("connect_error", (err) => {
  console.log("SOCKET ERROR:", err.message);
  window.socketStatus = err.message;
});
