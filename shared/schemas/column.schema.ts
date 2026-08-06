import { z } from "zod";

export const columnSchema = z.object({
  id: z.string().uuid(),
  boardId: z.string().uuid(),
  name: z.string().min(1),
  position: z.number().int(),
  wipLimit: z.number().int().positive().nullable(),
  color: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createColumnSchema = columnSchema.pick({ name: true, wipLimit: true, color: true });

export const updateColumnSchema = columnSchema
  .pick({ name: true, position: true, wipLimit: true, color: true })
  .partial();

export type Column = z.infer<typeof columnSchema>;
export type CreateColumnInput = z.infer<typeof createColumnSchema>;
export type UpdateColumnInput = z.infer<typeof updateColumnSchema>;
