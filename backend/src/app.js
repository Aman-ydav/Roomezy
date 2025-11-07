import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/apiError.js";
import "./config.js";

const app = express();


const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
    
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        console.log(`[CORS] Allowed origin: ${origin}`);
        return callback(null, true);
      } else {
        console.warn(`[CORS] Blocked origin: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({limit: "16kb"}));

app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));

app.use(cookieParser());


// routes import
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import savedPostRoutes from "./routes/savedPost.routes.js";
import mediaRoutes from "./routes/media.routes.js";


// route declaration
app.use("/api/v1/users",userRoutes)
app.use("/api/v1/posts",postRoutes)
app.use("/api/v1/savedposts", savedPostRoutes);
app.use("/api/v1/media", mediaRoutes);


app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }
  // fallback for any unknown error
  return res
    .status(500)
    .json({ success: false, message: err.message || "Server Error" });
});

export {app};
