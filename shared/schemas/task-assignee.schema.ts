import { z } from "zod";

export const taskAssigneeSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  userId: z.string().uuid(),
  assignedAt: z.date(),
});

export const assignTaskSchema = z.object({
  userId: z.string().uuid(),
});

export type TaskAssignee = z.infer<typeof taskAssigneeSchema>;
export type AssignTaskInput = z.infer<typeof assignTaskSchema>;
