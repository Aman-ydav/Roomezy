import { Server } from "socket.io";

const onlineUsers = new Map(); // userId → socketId

export const initSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "https://roomezy.vercel.app",
        "http://localhost:5173",
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
      ],
      exposedHeaders: ["set-cookie"],
    },
  });

  console.log("Socket.IO initialized");

  io.on("connection", (socket) => {
    console.log(" User connected:", socket.id);

    // --------------------------
    // USER IDENTIFIES THEMSELF
    // --------------------------
    socket.on("user-connected", (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId; // store user id inside socket instance

      console.log(`User Online: ${userId}`);
    });

    // --------------------------
    //  JOIN CONVERSATION ROOM
    // --------------------------
    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User (${socket.userId}) joined room: ${conversationId}`);
    });

    // --------------------------
    // SEND MESSAGE
    // --------------------------
    socket.on("send-message", ({ conversationId, senderId, receiverId, text }) => {
      const messagePayload = {
        conversationId,
        sender: senderId,
        receiver: receiverId,
        text,
        read: false,
        createdAt: new Date(),
      };

      // Broadcast to conversation room except sender
      socket.to(conversationId).emit("receive-message", messagePayload);

      // Notify receiver if online
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("new-message-alert", {
          conversationId,
          from: senderId,
          lastMessage: text,
        });
      }

      // Notify sender as well (last message UI update)
      const senderSocket = onlineUsers.get(senderId);
      if (senderSocket) {
        io.to(senderSocket).emit("new-message-alert", {
          conversationId,
          from: senderId,
          lastMessage: text,
        });
      }
    });

    // --------------------------
    //  LIVE TYPING EVENTS
    // --------------------------
    socket.on("typing", ({ conversationId, userId }) => {
      socket.to(conversationId).emit("typing", { userId });
    });

    socket.on("stop-typing", ({ conversationId, userId }) => {
      socket.to(conversationId).emit("stop-typing", { userId });
    });

    // --------------------------
    //  USER DISCONNECT
    // --------------------------
    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        console.log(` User disconnected: ${socket.userId}`);
      }
    });
  });

  return io;
};
