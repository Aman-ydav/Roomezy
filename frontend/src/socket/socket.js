import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  auth: { token: null },
});

// Call this on login — sets the JWT before connecting
export function connectSocket(accessToken) {
  socket.auth.token = accessToken;
  if (!socket.connected) socket.connect();
}

socket.on("connect", () => {
  window.socketStatus = "CONNECTED";
});

socket.on("connect_error", (err) => {
  window.socketStatus = err.message;
});
