import { z } from "zod";
import { TASK_PRIORITY } from "../types/enums";

export const taskSchema = z.object({
  id: z.string().uuid(),
  columnId: z.string().uuid().nullable(),
  boardId: z.string().uuid().nullable(),
  projectId: z.string().uuid(),
  sprintId: z.string().uuid().nullable(),
  title: z.string().min(1),
  description: z.string().nullable(),
  position: z.number().int(),
  priority: z.enum(TASK_PRIORITY),
  dueDate: z.date().nullable(),
  estimatedPoints: z.number().int().nonnegative().nullable(),
  createdBy: z.string().uuid(),
  isArchived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const createTaskSchema = taskSchema.pick({
  title: true,
  description: true,
  priority: true,
  dueDate: true,
  estimatedPoints: true,
});

export const updateTaskSchema = taskSchema
  .pick({
    title: true,
    description: true,
    priority: true,
    dueDate: true,
    estimatedPoints: true,
  })
  .partial();

export const moveTaskSchema = z.object({
  columnId: z.string().uuid().nullable().optional(),
  boardId: z.string().uuid().nullable().optional(),
  sprintId: z.string().uuid().nullable().optional(),
  position: z.number().int(),
});

export type Task = z.infer<typeof taskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;
