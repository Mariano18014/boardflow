import { prisma } from "../../db/client";

type Pagination = {
  limit: number;
  offset: number;
};

export async function findTasksWithoutSprint(projectId: string, pagination: Pagination) {
  return prisma.task.findMany({
    where: { projectId, sprintId: null, isArchived: false, deletedAt: null },
    orderBy: { position: "asc" },
    take: pagination.limit,
    skip: pagination.offset,
  });
}
