import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({origin: ["http://localhost:5173"], credentials: true}));

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




export {app};
