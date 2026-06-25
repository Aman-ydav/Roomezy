import Subscription from "../models/subscription.model.js";
import webpush from "./push.js";

export async function sendNotification(userId, payload) {
  const subs = await Subscription.find({ userId });
  const data = JSON.stringify(payload);

  for (let sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: sub.keys },
        data
      );
    } catch (err) {
      // 410 Gone or 404 = subscription expired/deleted — clean it up
      if (err.statusCode === 410 || err.statusCode === 404) {
        await Subscription.deleteOne({ endpoint: sub.endpoint });
      }
    }
  }
}
