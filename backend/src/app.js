// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import "./config.js";
import { ApiError } from "./utils/apiError.js";

// ROUTES
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import savedPostRoutes from "./routes/savedPost.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

//  1. TRUST PROXY (for Vercel, Render, Railway, HTTPS)

app.set("trust proxy", 1);

//  2. CORS CONFIGURATION (professional)

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : [];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true); // mobile apps / postman

            if (allowedOrigins.includes(origin)) {
                console.log(`[CORS] Allowed: ${origin}`);
                return callback(null, true);
            }

            console.warn(`[CORS] Blocked: ${origin}`);
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept",
        ],
        exposedHeaders: ["set-cookie"],
    })
);

// 3. SECURITY & PERFORMANCE MIDDLEWARES
app.use(
    helmet({
        crossOriginOpenerPolicy: false, // REQUIRED for Google Login (GSI)
        contentSecurityPolicy: false, // (optional) disables strict CSP that also blocks GSI
    })
);
// secure HTTP headers
app.use(compression()); // gzip compression
app.use(morgan("dev")); // request logger

//  4. BODY PARSERS

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// 5. STATIC FILES

app.use(express.static("public"));

// 6. HEALTH CHECK ROUTE

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Roomezy backend is live!",
        timestamp: new Date().toISOString(),
    });
});

// 7. API ROUTES

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/savedposts", savedPostRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/chat", chatRoutes);

//  8. NOT FOUND HANDLER

app.use((req, res, next) => {
    return res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`,
    });
});

//  9. GLOBAL ERROR HANDLER

app.use((err, req, res, next) => {
    console.error("Global Error:", err);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    return res.status(500).json({
        success: false,
        message: err.message || "Server Error",
    });
});

export { app };
