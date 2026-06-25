import "./config.js";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import http from "http";
import cron from "node-cron";
import { initSocketServer } from "./socket/index.js";
import { User } from "./models/user.model.js";
import { Post } from "./models/post.model.js";
import { Message } from "./models/message.model.js";

const server = http.createServer(app);

export const io = initSocketServer(server);

connectDB()
  .then(async () => {
    await User.syncIndexes();
    await Post.syncIndexes();
    await Message.syncIndexes();

    // Hourly cron: reset KYC awaiting_payment that missed the 3-day deadline
    cron.schedule("0 * * * *", async () => {
      try {
        const result = await User.updateMany(
          {
            kycStatus: "awaiting_payment",
            kycPaymentDeadline: { $lt: new Date() },
          },
          {
            $set: {
              kycStatus: "none",
              kycMatchedAt: null,
              kycPaymentDeadline: null,
            },
          }
        );
        if (result.modifiedCount > 0) {
          console.log(`[KYC cron] Reset ${result.modifiedCount} expired KYC session(s)`);
        }
      } catch (err) {
        console.error("[KYC cron] Error:", err.message);
      }
    });

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
