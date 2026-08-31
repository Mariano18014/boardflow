import type { Comment, User } from "@prisma/client";
import type { CommentAuthor, CommentWithAuthor } from "@shared/schemas/comment.schema";
import { findProjectById } from "../../../services/project.service";
import { checkRequesterHasPermission } from "../../permissions/check-permission";
import { findTaskById } from "../task.service";
import { createComment as saveCommentRecord, findCommentRecordsByTaskId } from "./comments.repository";

type CommentRecordWithAuthor = Comment & { author: User };

export type CreateCommentInput = {
  organizationId: string;
  projectId: string;
  taskId: string;
  content: string;
};

export async function createComment(
  input: CreateCommentInput,
  authorId: string,
): Promise<CommentWithAuthor> {
  await checkRequesterHasPermission(input.organizationId, authorId, "comments:create");
  // findTaskById only confirms the task belongs to projectId — it says
  // nothing about projectId belonging to organizationId, so this extra check
  // (same as every other module in this codebase) is what actually prevents
  // cross-organization access.
  await findProjectById(input.projectId, input.organizationId);
  const task = await findTaskById(input.taskId, input.projectId);
  const comment = await saveCommentInDatabase(input, task.id, authorId);
  return comment;
}

async function saveCommentInDatabase(
  input: CreateCommentInput,
  taskId: string,
  authorId: string,
): Promise<CommentWithAuthor> {
  const record = await saveCommentRecord({ taskId, authorId, content: input.content });
  return mapCommentRecordToResponse(record);
}

type Pagination = {
  limit: number;
  offset: number;
};

export type GetTaskCommentsInput = {
  organizationId: string;
  projectId: string;
  taskId: string;
  pagination: Pagination;
};

export async function getTaskComments(
  input: GetTaskCommentsInput,
  requesterId: string,
): Promise<CommentWithAuthor[]> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "comments:view");
  await findProjectById(input.projectId, input.organizationId);
  const task = await findTaskById(input.taskId, input.projectId);
  return findCommentsForTask(task.id, input.pagination);
}

async function findCommentsForTask(taskId: string, pagination: Pagination): Promise<CommentWithAuthor[]> {
  const records = await findCommentRecordsByTaskId(taskId, pagination);
  return records.map(mapCommentRecordToResponse);
}

function mapCommentRecordToResponse(record: CommentRecordWithAuthor): CommentWithAuthor {
  return {
    id: record.id,
    taskId: record.taskId,
    content: record.content,
    editedAt: record.editedAt,
    createdAt: record.createdAt,
    author: mapUserToCommentAuthor(record.author),
  };
}

function mapUserToCommentAuthor(user: User): CommentAuthor {
  return {
    id: user.id,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
  };
}
