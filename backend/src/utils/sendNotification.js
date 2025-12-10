import Subscription from "../models/subscription.model.js";
import webpush from "./push.js";

export async function sendNotification(userId, payload) {
  const subs = await Subscription.find({ userId });

  const data = JSON.stringify(payload);

  for (let sub of subs) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: sub.keys
        },
        data
      );
    } catch (e) {
      console.log("push error", e);
    }
  }
}
