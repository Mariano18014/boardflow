import type { Notification } from "@prisma/client";
import {
  COMMENT_MENTION_NOTIFICATION_TYPE,
  TASK_ASSIGNED_NOTIFICATION_TYPE,
  type CommentMentionNotificationPayload,
  type TaskAssignedNotificationPayload,
} from "@shared/schemas/notification.schema";
import { NotFoundError } from "../../lib/errors";
import {
  createNotification,
  findNotificationRecordByIdAndUserId,
  findNotificationRecordsByUserId,
  markNotificationAsReadInDatabase,
} from "./notifications.repository";

export async function createTaskAssignedNotification(
  userId: string,
  payload: TaskAssignedNotificationPayload,
): Promise<void> {
  await createNotification({ userId, type: TASK_ASSIGNED_NOTIFICATION_TYPE, payload });
}

export async function createCommentMentionNotification(
  userId: string,
  payload: CommentMentionNotificationPayload,
): Promise<void> {
  await createNotification({ userId, type: COMMENT_MENTION_NOTIFICATION_TYPE, payload });
}

type Pagination = {
  limit: number;
  offset: number;
};

export type GetMyNotificationsInput = {
  unreadOnly: boolean;
  pagination: Pagination;
};

export async function getMyNotifications(
  input: GetMyNotificationsInput,
  requesterId: string,
): Promise<Notification[]> {
  return findNotificationsForUser(requesterId, input.unreadOnly, input.pagination);
}

async function findNotificationsForUser(
  userId: string,
  unreadOnly: boolean,
  pagination: Pagination,
): Promise<Notification[]> {
  return findNotificationRecordsByUserId(userId, unreadOnly, pagination);
}

export async function markNotificationAsRead(notificationId: string, requesterId: string): Promise<Notification> {
  const notification = await findNotificationById(notificationId, requesterId);
  return saveNotificationAsRead(notification.id);
}

async function findNotificationById(notificationId: string, userId: string): Promise<Notification> {
  const notification = await findNotificationRecordByIdAndUserId(notificationId, userId);
  if (!notification) {
    throw new NotFoundError("La notificación no existe.");
  }
  return notification;
}

async function saveNotificationAsRead(notificationId: string): Promise<Notification> {
  return markNotificationAsReadInDatabase(notificationId, new Date());
}
