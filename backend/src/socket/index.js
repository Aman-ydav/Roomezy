import { Server } from "socket.io";
import { sendNotification } from "../utils/sendNotification.js";
import { User } from "../models/user.model.js";

const onlineUsers = new Map();

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

        // USER CONNECT
        socket.on("user-connected", (userId) => {
            onlineUsers.set(userId, socket.id);
            socket.userId = userId;
            socket.broadcast.emit("user-online", userId);
        });

        socket.on("check-user-status", (userId) => {
            socket.emit("user-status", {
                userId,
                isOnline: onlineUsers.has(userId),
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
        socket.on(
            "delete-message-everyone",
            ({ conversationId, messageId }) => {
                io.to(conversationId).emit("message-deleted-everyone", {
                    messageId,
                    conversationId,
                });
            }
        );

        // DELETE FOR ME
        socket.on(
            "delete-message-me",
            ({ messageId, userId, conversationId }) => {
                io.to(socket.id).emit("message-deleted-me", {
                    messageId,
                    userId,
                    conversationId,
                });
            }
        );

        // SEND MESSAGE
        socket.on(
            "send-message",
            async ({ conversationId, senderId, receiverId, text }) => {
                socket.to(conversationId).emit("receive-message", {
                    conversationId,
                    senderId,
                    receiverId,
                    text,
                    createdAt: new Date(),
                });

                const sender = await User.findById(senderId).select("userName");

                await sendNotification(receiverId, {
                    title: `New message from ${sender.userName}`,
                    body: text,
                    url: `/chat/${conversationId}`,
                });
            }
        );

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
                socket.broadcast.emit("user-offline", socket.userId);
            }
        });
    });

    return io;
};
