import { z } from "zod";
import { paginationQuerySchema } from "./pagination.schema";

export const notificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.string().min(1),
  payload: z.record(z.unknown()),
  readAt: z.date().nullable(),
  createdAt: z.date(),
});

export const listNotificationsQuerySchema = paginationQuerySchema.extend({
  unreadOnly: z.coerce.boolean().default(false),
});

export type Notification = z.infer<typeof notificationSchema>;
export type ListNotificationsQuery = z.infer<typeof listNotificationsQuerySchema>;

export const TASK_ASSIGNED_NOTIFICATION_TYPE = "task_assigned";

export type TaskAssignedNotificationPayload = {
  taskId: string;
  taskTitle: string;
  projectId: string;
  organizationId: string;
  assignedByUserId: string;
  assignedByName: string;
};

export const COMMENT_MENTION_NOTIFICATION_TYPE = "comment_mention";

export type CommentMentionNotificationPayload = {
  commentId: string;
  taskId: string;
  taskTitle: string;
  projectId: string;
  organizationId: string;
  mentionedByUserId: string;
  mentionedByName: string;
  commentExcerpt: string;
};

export type NotificationResponse = {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  readAt: Date | null;
  createdAt: Date;
};
