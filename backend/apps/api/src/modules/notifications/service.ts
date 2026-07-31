import { prisma } from "@vizagops/prisma";
import { broadcastEvent } from "../../ws";

/**
 * NotificationService — In-app notification management.
 * 
 * Since we don't have a Notification model in the schema (keeping DB lean for MVP),
 * notifications are ephemeral — broadcast via WebSocket in real-time and
 * stored in-memory with a configurable retention window.
 */

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  priority: "low" | "medium" | "high" | "critical";
  read: boolean;
  createdAt: Date;
}

// In-memory notification store (MVP — would be DB-backed in production)
const notifications: Notification[] = [];
const MAX_NOTIFICATIONS = 500;

export class NotificationService {
  /**
   * Create and broadcast a notification.
   */
  async createNotification(payload: {
    userId?: string;
    title: string;
    message: string;
    priority?: "low" | "medium" | "high" | "critical";
  }) {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userId: payload.userId || "SYSTEM",
      title: payload.title,
      message: payload.message,
      priority: payload.priority || "medium",
      read: false,
      createdAt: new Date()
    };

    notifications.unshift(notification);

    // Prune old notifications
    if (notifications.length > MAX_NOTIFICATIONS) {
      notifications.splice(MAX_NOTIFICATIONS);
    }

    // Broadcast via WebSocket
    broadcastEvent("notification.new", {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      createdAt: notification.createdAt
    });

    return notification;
  }

  /**
   * Get recent notifications (optionally filtered by userId).
   */
  getNotifications(userId?: string, limit = 50): Notification[] {
    let result = notifications;
    if (userId) {
      result = result.filter((n) => n.userId === userId || n.userId === "SYSTEM");
    }
    return result.slice(0, limit);
  }

  /**
   * Mark a notification as read.
   */
  markAsRead(notificationId: string): boolean {
    const notif = notifications.find((n) => n.id === notificationId);
    if (notif) {
      notif.read = true;
      return true;
    }
    return false;
  }

  /**
   * Get unread count.
   */
  getUnreadCount(userId?: string): number {
    let result = notifications;
    if (userId) {
      result = result.filter((n) => n.userId === userId || n.userId === "SYSTEM");
    }
    return result.filter((n) => !n.read).length;
  }
}
