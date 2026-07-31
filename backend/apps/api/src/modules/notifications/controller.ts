import { sendSuccess } from "@vizagops/api";
import { NotificationService } from "./service";

const service = new NotificationService();

/**
 * GET /api/v1/notifications
 * Get notifications for the current user.
 */
export const getNotifications = async (req: any, res: any, next: any) => {
  try {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit, 10) || 50;
    const results = service.getNotifications(userId, limit);
    const unread = service.getUnreadCount(userId);
    sendSuccess(res, { notifications: results, unreadCount: unread }, "Notifications retrieved");
  } catch (err) { next(err); }
};

/**
 * POST /api/v1/notifications
 * Create a broadcast notification (admin only).
 */
export const createNotification = async (req: any, res: any, next: any) => {
  try {
    const notification = await service.createNotification({
      userId: req.body.userId,
      title: req.body.title,
      message: req.body.message,
      priority: req.body.priority
    });
    sendSuccess(res, notification, "Notification created and broadcasted");
  } catch (err) { next(err); }
};

/**
 * PATCH /api/v1/notifications/:id/read
 * Mark a notification as read.
 */
export const markNotificationRead = async (req: any, res: any, next: any) => {
  try {
    const success = service.markAsRead(req.params.id);
    if (!success) {
      return res.status(404).json({
        success: false,
        error: { code: "NOTIFICATION_NOT_FOUND", message: "Notification not found" }
      });
    }
    sendSuccess(res, { id: req.params.id, read: true }, "Notification marked as read");
  } catch (err) { next(err); }
};
