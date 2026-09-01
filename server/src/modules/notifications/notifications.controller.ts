import type { NextFunction, Request, Response } from "express";
import {
  listNotificationsQuerySchema,
  type ListNotificationsQuery,
  type NotificationResponse,
} from "@shared/schemas/notification.schema";
import type { Notification } from "@prisma/client";
import { ValidationError } from "../../lib/errors";
import { getMyNotifications, markNotificationAsRead } from "./notifications.service";

export async function listMyNotificationsController(req: Request, res: Response, next: NextFunction) {
  try {
    const query = parseListNotificationsQuery(req.query);
    const notifications = await getMyNotifications(
      { unreadOnly: query.unreadOnly, pagination: { limit: query.limit, offset: query.offset } },
      req.userId!,
    );
    res.status(200).json({
      notifications: notifications.map(formatNotificationForResponse),
      pagination: { limit: query.limit, offset: query.offset },
    });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationAsReadController(req: Request, res: Response, next: NextFunction) {
  try {
    const notificationId = parseNotificationIdParam(req.params.notificationId);
    const notification = await markNotificationAsRead(notificationId, req.userId!);
    res.status(200).json({ notification: formatNotificationForResponse(notification) });
  } catch (error) {
    next(error);
  }
}

function parseNotificationIdParam(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ notificationId: ["notificationId inválido."] });
  }
  return value;
}

function parseListNotificationsQuery(query: unknown): ListNotificationsQuery {
  const result = listNotificationsQuerySchema.safeParse(query);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function formatNotificationForResponse(notification: Notification): NotificationResponse {
  return {
    id: notification.id,
    type: notification.type,
    payload: notification.payload as Record<string, unknown>,
    readAt: notification.readAt,
    createdAt: notification.createdAt,
  };
}
