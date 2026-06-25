import { Notification } from "../models/notification.model.js";

export async function createNotification({ userId, type, title, body, link = null, meta = {} }) {
  try {
    const notif = await Notification.create({ userId, type, title, body, link, meta });
    return notif;
  } catch (err) {
    console.error("[Notification] Failed to create:", err.message);
    return null;
  }
}
