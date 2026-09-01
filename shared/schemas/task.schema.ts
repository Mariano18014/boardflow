import { z } from "zod";
import { TASK_PRIORITY, type TaskPriority } from "../types/enums";
import { paginationQuerySchema } from "./pagination.schema";
import type { AssigneeSummary } from "./task-assignee.schema";
import type { LabelSummary } from "./task-label.schema";

export const taskSchema = z.object({
  id: z.string().uuid(),
  columnId: z.string().uuid().nullable(),
  boardId: z.string().uuid().nullable(),
  projectId: z.string().uuid(),
  sprintId: z.string().uuid().nullable(),
  title: z.string().min(1).max(200),
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

export const updateTaskDetailsBodySchema = z.object({
  title: z.string().max(200).optional(),
  description: z.string().optional(),
  priority: z.enum(TASK_PRIORITY).optional(),
  estimatedPoints: z.number().int().optional(),
  dueDate: z.string().optional(),
});

export const moveTaskSchema = z.object({
  columnId: z.string().uuid().nullable().optional(),
  boardId: z.string().uuid().nullable().optional(),
  sprintId: z.string().uuid().nullable().optional(),
  position: z.number().int(),
});

export const listBacklogQuerySchema = paginationQuerySchema;

export const createBacklogTaskBodySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  priority: z.enum(TASK_PRIORITY),
  estimatedPoints: z.number().int().positive(),
});

export const createBacklogTaskSchema = createBacklogTaskBodySchema.extend({
  organizationId: z.string().uuid(),
  projectId: z.string().uuid(),
});

export const reorderBacklogTasksSchema = z.object({
  taskIds: z.array(z.string().uuid()).min(1),
});

export const assignTaskToSprintSchema = z.object({
  sprintId: z.string().uuid().nullable(),
});

export const moveTaskToColumnSchema = z.object({
  columnId: z.string().uuid(),
  position: z.number().int().nonnegative(),
});

export type Task = z.infer<typeof taskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskDetailsBody = z.infer<typeof updateTaskDetailsBodySchema>;
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;
export type ListBacklogQuery = z.infer<typeof listBacklogQuerySchema>;
export type CreateBacklogTaskBody = z.infer<typeof createBacklogTaskBodySchema>;
export type CreateBacklogTaskInput = z.infer<typeof createBacklogTaskSchema>;
export type ReorderBacklogTasksBody = z.infer<typeof reorderBacklogTasksSchema>;
export type AssignTaskToSprintBody = z.infer<typeof assignTaskToSprintSchema>;
export type MoveTaskToColumnBody = z.infer<typeof moveTaskToColumnSchema>;

export type BacklogTaskItem = {
  id: string;
  title: string;
  priority: TaskPriority;
  estimatedPoints: number | null;
  position: number;
  createdAt: Date;
  assignees: AssigneeSummary[];
  labels: LabelSummary[];
};

export type TaskDetail = {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  estimatedPoints: number | null;
  dueDate: Date | null;
  position: number;
  sprintId: string | null;
  columnId: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  assignees: AssigneeSummary[];
  labels: LabelSummary[];
};
