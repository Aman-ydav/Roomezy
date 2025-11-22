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

      // Broadcast to all other users that this user is online
      socket.broadcast.emit("user-online", userId);
      
      console.log(`User Online: ${userId}`);
    });

    // --------------------------
    // CHECK USER STATUS
    // --------------------------
    socket.on("check-user-status", (userId) => {
      const isOnline = onlineUsers.has(userId);
      socket.emit("user-status", { userId, isOnline });
    });

    // --------------------------
    //  JOIN CONVERSATION ROOM
    // --------------------------
    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User (${socket.userId}) joined room: ${conversationId}`);
    });

    socket.on("leave-conversation", (conversationId) => {
      socket.leave(conversationId);
      console.log(`User (${socket.userId}) left room: ${conversationId}`);
    });

    // --------------------------
    // SEND MESSAGE
    // --------------------------
    socket.on("send-message", ({ conversationId, senderId, receiverId, text }) => {
      const messagePayload = {
        conversationId,
        senderId,
        receiverId,
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
          lastMessage: { text, createdAt: new Date() },
        });
      }
     
    });

    // --------------------------
    //  LIVE TYPING EVENTS - FIXED
    // --------------------------
    socket.on("typing", ({ conversationId, userId }) => {
      console.log(`User ${userId} typing in ${conversationId}`);
      // Send to everyone in conversation except the sender
      socket.to(conversationId).emit("typing", { 
        conversationId, 
        userId 
      });
    });

    socket.on("stop-typing", ({ conversationId, userId }) => {
      console.log(`User ${userId} stopped typing in ${conversationId}`);
      // Send to everyone in conversation except the sender
      socket.to(conversationId).emit("stop-typing", { 
        conversationId, 
        userId 
      });
    });

    // --------------------------
    //  USER DISCONNECT
    // --------------------------
    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        // Broadcast that user went offline
        socket.broadcast.emit("user-offline", socket.userId);
        console.log(` User disconnected: ${socket.userId}`);
      }
    });

    // --------------------------
    // MANUALLY SET OFFLINE
    // --------------------------
    socket.on("user-offline", (userId) => {
      onlineUsers.delete(userId);
      socket.broadcast.emit("user-offline", userId);
      console.log(`User manually went offline: ${userId}`);
    });
  });

  return io;
};