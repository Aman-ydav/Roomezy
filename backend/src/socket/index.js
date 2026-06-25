import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { sendNotification } from "../utils/sendNotification.js";
import { createNotification } from "../utils/createNotification.js";
import { User } from "../models/user.model.js";

// Presence state
const onlineUsers = new Map();      // userId → Set<socketId>  (multi-tab safe)
const lastPing = new Map();         // userId → timestamp
const userVisibility = new Map();   // userId → boolean

// Socket rate limiting
const lastMessageSent = new Map();  // userId → timestamp
const lastTypingEvent = new Map();  // userId → timestamp

// Shared io reference so controllers can ping the bell without circular imports
let _io = null;

// Helper — get any active socketId for a user
function getSocketId(userId) {
  const sockets = onlineUsers.get(userId?.toString());
  if (!sockets?.size) return null;
  return sockets.values().next().value;
}

// Call from controllers after createNotification to update bell in real time
export function notifyUser(userId) {
  if (!_io) return;
  const socketId = getSocketId(userId?.toString());
  if (socketId) _io.to(socketId).emit("new-notification");
}

export const initSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["https://roomezy.vercel.app", "http://localhost:5173"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
    },
  });

  // Authenticate socket connection via JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      socket.userId = decoded._id.toString();
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  _io = io;

  io.on("connection", (socket) => {
    const userId = socket.userId;
    console.log("User connected:", socket.id, "userId:", userId);

    // USER CONNECTED — register this socket in the user's Set
    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);
    lastPing.set(userId, Date.now());
    userVisibility.set(userId, true);
    io.emit("user-online", userId);

    // HEARTBEAT
    socket.on("heartbeat", () => {
      lastPing.set(userId, Date.now());
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set([socket.id]));
        io.emit("user-online", userId);
      }
    });

    // VISIBILITY STATE FROM CLIENT
    socket.on("visibility", ({ visible }) => {
      userVisibility.set(userId, visible);
    });

    // CHECK USER STATUS
    socket.on("check-user-status", (targetUserId) => {
      const uid = targetUserId?.toString();
      const isOnline = (onlineUsers.get(uid)?.size || 0) > 0;
      socket.emit("user-status", { userId: uid, isOnline });
    });

    // JOIN ROOM
    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId);
    });

    // LEAVE ROOM
    socket.on("leave-conversation", (conversationId) => {
      socket.leave(conversationId);
    });

    // DELETE FOR EVERYONE — server emits after frontend API call succeeds
    socket.on("delete-message-everyone", ({ conversationId, messageId }) => {
      io.to(conversationId).emit("message-deleted-everyone", {
        messageId,
        conversationId,
      });
    });

    // DELETE FOR ME
    socket.on("delete-message-me", ({ messageId, conversationId }) => {
      socket.emit("message-deleted-me", { messageId, userId, conversationId });
    });

    // SEND MESSAGE
    socket.on("send-message", async ({ conversationId, receiverId, text, _id }) => {
      // Rate limit: max 2 messages per second per user
      const now = Date.now();
      const lastSent = lastMessageSent.get(userId) || 0;
      if (now - lastSent < 500) return;
      lastMessageSent.set(userId, now);

      try {
        const sender = await User.findById(userId).select("userName avatar");

        const payload = {
          _id,
          conversationId,
          senderId: userId,
          receiverId,
          text,
          senderName: sender?.userName || "User",
          senderAvatar: sender?.avatar || null,
          createdAt: new Date(),
        };

        // Deliver live if receiver is online
        const receiverSocketId = getSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive-message", payload);
        }

        const rid = receiverId?.toString();

        // Check if receiver is actively viewing this conversation (in the socket room)
        const roomMembers    = io.sockets.adapter.rooms.get(conversationId);
        const receiverSockets = onlineUsers.get(rid);
        let receiverInConversation = false;
        if (roomMembers && receiverSockets) {
          for (const sid of receiverSockets) {
            if (roomMembers.has(sid)) { receiverInConversation = true; break; }
          }
        }

        // Skip everything — they can see the message live in the open chat
        if (receiverInConversation) return;

        // Save in-app notification and emit real-time bell update
        const notif = await createNotification({
          userId: rid,
          type:   "new_message",
          title:  sender?.userName || "New message",
          body:   text.length > 80 ? text.slice(0, 77) + "..." : text,
          link:   "/inbox",
          meta:   { conversationId, senderId: userId },
        });

        if (notif) {
          const receiverSocketId = getSocketId(rid);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("new-notification");
          }
        }

        // Push only when tab is not visible (fix: use toString() for map lookup)
        const isVisible = userVisibility.get(rid);
        if (!isVisible) {
          sendNotification(rid, {
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
      const now = Date.now();
      const lastTyped = lastTypingEvent.get(userId) || 0;
      if (now - lastTyped < 1000) return;
      lastTypingEvent.set(userId, now);
      socket.to(data.conversationId).emit("typing", { ...data, userId });
    });

    socket.on("stop-typing", (data) => {
      socket.to(data.conversationId).emit("stop-typing", { ...data, userId });
    });

    // DISCONNECT — remove this socket from the user's Set
    socket.on("disconnect", () => {
      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          lastPing.delete(userId);
          userVisibility.delete(userId);
          io.emit("user-offline", userId);
        }
      }
    });
  });

  // HEARTBEAT CLEANUP — remove users who stopped pinging
  setInterval(() => {
    const now = Date.now();
    for (const [uid, timestamp] of lastPing) {
      if (now - timestamp > 45000) {
        onlineUsers.delete(uid);
        lastPing.delete(uid);
        userVisibility.delete(uid);
        io.emit("user-offline", uid);
      }
    }
  }, 10000);

  return io;
};
