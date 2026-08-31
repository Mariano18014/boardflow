import type { Prisma } from "@prisma/client";
import { prisma } from "../../db/client";

export type CreateActivityLogData = {
  organizationId: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Prisma.InputJsonValue;
};

export async function createActivityLog(data: CreateActivityLogData) {
  return prisma.activityLog.create({ data });
}

export async function findActivityLogsByEntityIds(
  entityType: string,
  entityIds: string[],
  actions: string[],
) {
  return prisma.activityLog.findMany({
    where: { entityType, entityId: { in: entityIds }, action: { in: actions } },
    orderBy: { createdAt: "asc" },
  });
}

export async function findActivityLogByEntityId(entityType: string, entityId: string, action: string) {
  return prisma.activityLog.findFirst({
    where: { entityType, entityId, action },
    orderBy: { createdAt: "desc" },
  });
}

type Pagination = {
  limit: number;
  offset: number;
};

export async function findActivityLogEntriesByOrganizationId(organizationId: string, pagination: Pagination) {
  return prisma.activityLog.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    take: pagination.limit,
    skip: pagination.offset,
    include: { actor: true },
  });
}
