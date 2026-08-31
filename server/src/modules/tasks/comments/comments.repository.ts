import { prisma } from "../../../db/client";

type CreateCommentData = {
  taskId: string;
  authorId: string;
  content: string;
};

export async function createComment(data: CreateCommentData) {
  return prisma.comment.create({ data, include: { author: true } });
}

type Pagination = {
  limit: number;
  offset: number;
};

export async function findCommentRecordsByTaskId(taskId: string, pagination: Pagination) {
  return prisma.comment.findMany({
    where: { taskId, deletedAt: null },
    orderBy: { createdAt: "asc" },
    take: pagination.limit,
    skip: pagination.offset,
    include: { author: true },
  });
}
