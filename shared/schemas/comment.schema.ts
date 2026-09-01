import { z } from "zod";
import { paginationQuerySchema } from "./pagination.schema";

const COMMENT_CONTENT_MAX_LENGTH = 2000;

export const commentSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  authorId: z.string().uuid(),
  content: z.string().min(1).max(COMMENT_CONTENT_MAX_LENGTH),
  editedAt: z.date().nullable(),
  createdAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const createCommentBodySchema = commentSchema.pick({ content: true });

export const createCommentSchema = createCommentBodySchema.extend({
  organizationId: z.string().uuid(),
  projectId: z.string().uuid(),
  taskId: z.string().uuid(),
});

export const updateCommentSchema = createCommentBodySchema;

export const listCommentsQuerySchema = paginationQuerySchema;

export type Comment = z.infer<typeof commentSchema>;
export type CreateCommentBody = z.infer<typeof createCommentBodySchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type ListCommentsQuery = z.infer<typeof listCommentsQuerySchema>;

export type CommentAuthor = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
};

export type CommentWithAuthor = {
  id: string;
  taskId: string;
  content: string;
  editedAt: Date | null;
  createdAt: Date;
  author: CommentAuthor;
};
