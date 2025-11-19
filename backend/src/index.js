import { app } from "./app.js";
import connectDB from "./db/index.js";
import "./config.js";
import { User } from "./models/user.model.js";

// NEW IMPORTS (required for socket.io)
import http from "http";
import { Server } from "socket.io";

// Store: userId → socketId
const onlineUsers = new Map();

// Create HTTP SERVER from express app
const server = http.createServer(app);

// Attach socket.io to server
const io = new Server(server, {
    cors: {
        origin: [
      "https://roomezy.vercel.app",
      "http://localhost:5173",
    ],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
         exposedHeaders: ["set-cookie"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept",
        ],
    },
});

// SOCKET.IO BASE SETUP
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // 1) USER CONNECTS WITH userId
    socket.on("user-connected", (userId) => {
        onlineUsers.set(userId, socket.id);
        socket.userId = userId; // store user id inside socket

        console.log("User online:", userId);
    });

    // 2) USER JOINS A CONVERSATION ROOM
    socket.on("join-conversation", (conversationId) => {
        socket.join(conversationId);
    });

    // 3) SEND MESSAGE EVENT
    socket.on("send-message", async (data) => {
        const { conversationId, senderId, receiverId, text } = data;

        // SEND TO EVERYONE EXCEPT SENDER
        socket.to(conversationId).emit("receive-message", {
            conversationId,
            sender: senderId,
            receiver: receiverId,
            text,
            read: false,
            createdAt: new Date(),
        });

        // If receiver is online, notify them
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("new-message-alert", {
                conversationId,
                from: senderId,
                lastMessage: text,
            });
        }

        const senderSocketId = onlineUsers.get(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("new-message-alert", {
                conversationId,
                from: senderId,
                lastMessage: text,
            });
        }
    });

    // 4) TYPING EVENT
    socket.on("typing", ({ conversationId, userId }) => {
        socket.to(conversationId).emit("typing", { userId });
    });

    socket.on("stop-typing", ({ conversationId, userId }) => {
        socket.to(conversationId).emit("stop-typing", { userId });
    });

    // 5) DISCONNECT
    socket.on("disconnect", () => {
        if (socket.userId) {
            onlineUsers.delete(socket.userId);
            console.log("User disconnected:", socket.userId);
        }
    });
});

// Make `io` accessible in other files later
export { io };

connectDB()
    .then(async () => {
        await User.syncIndexes();

        app.on("error", (err) => {
            console.log("Error on App:", err);
            throw err;
        });

        // IMPORTANT — use server.listen instead of app.listen
        server.listen(process.env.PORT || 8000, () => {
            console.log(
                `App (and Socket.IO) is running on port ${process.env.PORT || 8000}`
            );
        });
    })
    .catch((err) => {
        console.log("MONGODB Connection not done", err);
        throw err;
    });

/*
import express from "express";
const app = express();

;(async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (err)=>{
            console.log("Error:", err);
            throw err;
        });
        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on ${process.env.PORT}`);
        })
    }
    catch(err){
        console.log("Error:", err);
        throw err;
    }
})()
*/
