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

export async function findCommentRecordByIdAndTaskId(commentId: string, taskId: string) {
  return prisma.comment.findFirst({
    where: { id: commentId, taskId },
    include: { author: true },
  });
}

type UpdateCommentContentData = {
  content: string;
  editedAt: Date;
};

export async function updateCommentContent(commentId: string, data: UpdateCommentContentData) {
  return prisma.comment.update({
    where: { id: commentId },
    data,
    include: { author: true },
  });
}

export async function softDeleteComment(commentId: string, deletedAt: Date) {
  return prisma.comment.update({
    where: { id: commentId },
    data: { deletedAt },
  });
}
