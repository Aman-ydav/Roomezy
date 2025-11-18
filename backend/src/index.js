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
        origin: "*",
        methods: ["GET", "POST"],
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

        // Emit to receiver if they are online
        const receiverSocketId = onlineUsers.get(receiverId);

        // Emit to specific conversation room
        io.to(conversationId).emit("receive-message", {
            conversationId,
            sender: senderId, // FIXED
            receiver: receiverId, // optional but correct
            text,
            read: false,
            createdAt: new Date(),
        });

        // If receiver is online, inform them about new unread count
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("new-message-alert", {
                conversationId,
                from: senderId,
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
