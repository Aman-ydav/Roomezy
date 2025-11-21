import "./config.js";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import http from "http";
import { initSocketServer } from "./socket/index.js";
import { User } from "./models/user.model.js";

const server = http.createServer(app);

// Initialize Socket.IO
export const io = initSocketServer(server);

connectDB()
  .then(async () => {
    await User.syncIndexes();

    server.listen(process.env.PORT || 8000, () => {
      console.log(
        `Roomezy backend + socket running on ${process.env.PORT || 8000}`
      );
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
