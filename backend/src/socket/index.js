import { Server } from "socket.io";
import { sendNotification } from "../utils/sendNotification.js";
import { User } from "../models/user.model.js";

// Presence state
const onlineUsers = new Map();      // userId → socketId
const lastPing = new Map();         // userId → timestamp
const userVisibility = new Map();   // userId → boolean

export const initSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["https://roomezy.vercel.app", "http://localhost:5173"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // USER CONNECTED
    socket.on("user-connected", (userId) => {
      socket.userId = userId;

      onlineUsers.set(userId, socket.id);
      lastPing.set(userId, Date.now());
      userVisibility.set(userId, true);

      io.emit("user-online", userId);
    });

    // HEARTBEAT
    socket.on("heartbeat", (userId) => {
      lastPing.set(userId, Date.now());

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, socket.id);
        io.emit("user-online", userId);
      }
    });

    // VISIBILITY STATE FROM CLIENT
    socket.on("visibility", ({ userId, visible }) => {
      userVisibility.set(userId, visible);
    });

    // CHECK USER STATUS
    socket.on("check-user-status", (userId) => {
      const isOnline = onlineUsers.has(userId);
      socket.emit("user-status", {
        userId,
        isOnline,
      });
    });

    // JOIN ROOM
    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId);
    });

    // LEAVE ROOM
    socket.on("leave-conversation", (conversationId) => {
      socket.leave(conversationId);
    });

    // DELETE FOR EVERYONE
    socket.on("delete-message-everyone", ({ conversationId, messageId }) => {
      io.to(conversationId).emit("message-deleted-everyone", {
        messageId,
        conversationId,
      });
    });

    // DELETE FOR ME
    socket.on("delete-message-me", ({ messageId, userId, conversationId }) => {
      io.to(socket.id).emit("message-deleted-me", {
        messageId,
        userId,
        conversationId,
      });
    });

    // SEND MESSAGE
    socket.on("send-message", async ({ conversationId, senderId, receiverId, text }) => {
      try {
        const sender = await User.findById(senderId).select("userName avatar");

        const payload = {
          conversationId,
          senderId,
          receiverId,
          text,
          senderName: sender?.userName || "User",
          senderAvatar: sender?.avatar || null,
          createdAt: new Date(),
        };

        // live message if online
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive-message", payload);
        }

        // Only send push if user not visible
        const isVisible = userVisibility.get(receiverId);
        if (!isVisible) {
          await sendNotification(receiverId, {
            title: `${sender?.userName || "New message"}`,
            body: text,
            url: "/inbox",
            conversationId,
          });
        }

      } catch (err) {
        console.error("Error in send-message:", err);
      }
    });

    // TYPING
    socket.on("typing", (data) => {
      socket.to(data.conversationId).emit("typing", data);
    });

    socket.on("stop-typing", (data) => {
      socket.to(data.conversationId).emit("stop-typing", data);
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        lastPing.delete(socket.userId);
        userVisibility.delete(socket.userId);

        io.emit("user-offline", socket.userId);
      }
    });
  });

  // HEARTBEAT CLEANUP
  setInterval(() => {
    const now = Date.now();
    for (const [userId, timestamp] of lastPing) {
      if (now - timestamp > 45000) {
        onlineUsers.delete(userId);
        lastPing.delete(userId);
        userVisibility.delete(userId);
        io.emit("user-offline", userId);
      }
    }
  }, 10000);

  return io;
};
