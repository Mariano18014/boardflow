import type { NextFunction, Request, Response } from "express";
import {
  createCommentBodySchema,
  listCommentsQuerySchema,
  type CommentWithAuthor,
  type CreateCommentBody,
  type ListCommentsQuery,
} from "@shared/schemas/comment.schema";
import { ValidationError } from "../../../lib/errors";
import { createComment, getTaskComments } from "./comments.service";

export async function createCommentController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const taskId = parseTaskIdParam(req.params.taskId);
    const body = parseCreateCommentRequestBody(req.body);
    const comment = await createComment(
      { organizationId, projectId, taskId, content: body.content },
      req.userId!,
    );
    res.status(201).json({ comment: formatCommentForResponse(comment) });
  } catch (error) {
    next(error);
  }
}

export async function listCommentsController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const taskId = parseTaskIdParam(req.params.taskId);
    const query = parseListCommentsQuery(req.query);
    const comments = await getTaskComments(
      {
        organizationId,
        projectId,
        taskId,
        pagination: { limit: query.limit, offset: query.offset },
      },
      req.userId!,
    );
    res.status(200).json({
      comments: comments.map(formatCommentForResponse),
      pagination: { limit: query.limit, offset: query.offset },
    });
  } catch (error) {
    next(error);
  }
}

function parseOrganizationIdParam(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ organizationId: ["organizationId inválido."] });
  }
  return value;
}

function parseProjectIdParam(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ projectId: ["projectId inválido."] });
  }
  return value;
}

function parseTaskIdParam(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ taskId: ["taskId inválido."] });
  }
  return value;
}

function parseCreateCommentRequestBody(body: unknown): CreateCommentBody {
  const result = createCommentBodySchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function parseListCommentsQuery(query: unknown): ListCommentsQuery {
  const result = listCommentsQuerySchema.safeParse(query);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function formatCommentForResponse(comment: CommentWithAuthor) {
  return {
    id: comment.id,
    taskId: comment.taskId,
    content: comment.content,
    editedAt: comment.editedAt,
    createdAt: comment.createdAt,
    author: comment.author,
  };
}
