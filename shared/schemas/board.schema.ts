import { z } from "zod";

export const boardSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string().min(1).max(100),
  position: z.number().int(),
  isArchived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createBoardBodySchema = boardSchema.pick({ name: true });

export const createBoardSchema = createBoardBodySchema.extend({
  organizationId: z.string().uuid(),
  projectId: z.string().uuid(),
});

export const updateBoardSchema = boardSchema.pick({ name: true, position: true }).partial();

export type Board = z.infer<typeof boardSchema>;
export type CreateBoardBody = z.infer<typeof createBoardBodySchema>;
export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
