import { z } from "zod";

export const commentSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  authorId: z.string().uuid(),
  content: z.string().min(1),
  editedAt: z.date().nullable(),
  createdAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const createCommentSchema = commentSchema.pick({ content: true });

export const updateCommentSchema = createCommentSchema;

export type Comment = z.infer<typeof commentSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
