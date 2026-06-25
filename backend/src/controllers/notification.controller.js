import { Notification } from "../models/notification.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /api/v1/notifications
export const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 30 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Notification.countDocuments({ userId: req.user._id, read: false }),
  ]);

  res.json(new ApiResponse(200, { notifications, unreadCount }, "Notifications fetched"));
});

// PATCH /api/v1/notifications/read-all
export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { userId: req.user._id, read: false },
    { $set: { read: true } }
  );
  res.json(new ApiResponse(200, null, "All notifications marked as read"));
});

// PATCH /api/v1/notifications/:id/read
export const markOneRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: { read: true } },
    { new: true }
  );
  if (!notification) throw new ApiError(404, "Notification not found");
  res.json(new ApiResponse(200, notification, "Notification marked as read"));
});

// DELETE /api/v1/notifications/:id
export const deleteOne = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!notification) throw new ApiError(404, "Notification not found");
  res.json(new ApiResponse(200, null, "Notification deleted"));
});

// DELETE /api/v1/notifications
export const deleteAll = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ userId: req.user._id });
  res.json(new ApiResponse(200, null, "All notifications deleted"));
});
