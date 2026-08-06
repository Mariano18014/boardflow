import { z } from "zod";

export const boardSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string().min(1),
  position: z.number().int(),
  isArchived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createBoardSchema = boardSchema.pick({ name: true });

export const updateBoardSchema = boardSchema.pick({ name: true, position: true }).partial();

export type Board = z.infer<typeof boardSchema>;
export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
