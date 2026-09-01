import type { Prisma } from "@prisma/client";
import { prisma } from "../../db/client";

type CreateNotificationData = {
  userId: string;
  type: string;
  payload: Prisma.InputJsonValue;
};

export async function createNotification(data: CreateNotificationData) {
  return prisma.notification.create({ data });
}

type Pagination = {
  limit: number;
  offset: number;
};

export async function findNotificationRecordsByUserId(
  userId: string,
  unreadOnly: boolean,
  pagination: Pagination,
) {
  return prisma.notification.findMany({
    where: { userId, ...(unreadOnly ? { readAt: null } : {}) },
    orderBy: { createdAt: "desc" },
    take: pagination.limit,
    skip: pagination.offset,
  });
}

export async function findNotificationRecordByIdAndUserId(notificationId: string, userId: string) {
  return prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });
}

export async function markNotificationAsReadInDatabase(notificationId: string, readAt: Date) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { readAt },
  });
}
