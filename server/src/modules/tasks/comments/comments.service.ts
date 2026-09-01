import type { Comment, User } from "@prisma/client";
import type { CommentAuthor, CommentWithAuthor } from "@shared/schemas/comment.schema";
import { extractMentionedUserIds } from "@shared/utils/mention.util";
import { ConflictError, ForbiddenError, NotFoundError } from "../../../lib/errors";
import { findProjectById } from "../../../services/project.service";
import { checkRequesterHasPermission } from "../../permissions/check-permission";
import { findTaskById } from "../task.service";
import {
  createComment as saveCommentRecord,
  findCommentRecordByIdAndTaskId,
  findCommentRecordsByTaskId,
  softDeleteComment as softDeleteCommentRecord,
  updateCommentContent,
} from "./comments.repository";
import { notifyMentionedUsers } from "./mentions.service";

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
  await notifyMentionedUsers(input.content, comment, task, input.organizationId, authorId, []);
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

export type EditCommentInput = {
  organizationId: string;
  projectId: string;
  taskId: string;
  commentId: string;
  content: string;
};

export async function editComment(
  input: EditCommentInput,
  requesterId: string,
): Promise<CommentWithAuthor> {
  await findProjectById(input.projectId, input.organizationId);
  const task = await findTaskById(input.taskId, input.projectId);
  const comment = await findCommentById(input.commentId, input.taskId);
  checkCommentIsNotDeleted(comment);
  await checkRequesterCanModifyComment(comment, requesterId, input.organizationId, "comments:edit");
  const previousMentionedIds = extractMentionedUserIds(comment.content);
  const updatedComment = await saveCommentEdit(comment, input.content);
  await notifyMentionedUsers(
    input.content,
    updatedComment,
    task,
    input.organizationId,
    requesterId,
    previousMentionedIds,
  );
  return updatedComment;
}

export type DeleteCommentInput = {
  organizationId: string;
  projectId: string;
  taskId: string;
  commentId: string;
};

export async function deleteComment(input: DeleteCommentInput, requesterId: string): Promise<void> {
  await findProjectById(input.projectId, input.organizationId);
  await findTaskById(input.taskId, input.projectId);
  const comment = await findCommentById(input.commentId, input.taskId);
  checkCommentIsNotDeleted(comment);
  await checkRequesterCanModifyComment(comment, requesterId, input.organizationId, "comments:delete");
  await softDeleteCommentRecord(comment.id, new Date());
}

async function findCommentById(commentId: string, taskId: string): Promise<CommentRecordWithAuthor> {
  const comment = await findCommentRecordByIdAndTaskId(commentId, taskId);
  if (!comment) {
    throw new NotFoundError("El comentario no existe en esta tarea.");
  }
  return comment;
}

function checkCommentIsNotDeleted(comment: CommentRecordWithAuthor): void {
  if (comment.deletedAt !== null) {
    throw new ConflictError("Este comentario ya fue eliminado.");
  }
}

// The author can always modify their own comment; anyone else needs the
// comments:edit / comments:delete permission granted to their role. We wrap
// checkRequesterHasPermission in try/catch instead of changing its behavior
// (it throws rather than returning a boolean) so a non-author without the
// permission gets this endpoint's own clear message, not a generic one.
async function checkRequesterCanModifyComment(
  comment: CommentRecordWithAuthor,
  requesterId: string,
  organizationId: string,
  permissionKey: string,
): Promise<void> {
  if (checkIsCommentAuthor(comment, requesterId)) {
    return;
  }
  await checkRequesterHasPermissionToModifyComment(organizationId, requesterId, permissionKey);
}

function checkIsCommentAuthor(comment: CommentRecordWithAuthor, requesterId: string): boolean {
  return comment.authorId === requesterId;
}

async function checkRequesterHasPermissionToModifyComment(
  organizationId: string,
  requesterId: string,
  permissionKey: string,
): Promise<void> {
  try {
    await checkRequesterHasPermission(organizationId, requesterId, permissionKey);
  } catch {
    throw new ForbiddenError("Solo el autor puede editar o eliminar este comentario.");
  }
}

async function saveCommentEdit(comment: CommentRecordWithAuthor, content: string): Promise<CommentWithAuthor> {
  const updated = await updateCommentContent(comment.id, { content, editedAt: new Date() });
  return mapCommentRecordToResponse(updated);
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
