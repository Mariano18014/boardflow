import { z } from "zod";

export const taskAssigneeSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  userId: z.string().uuid(),
  assignedAt: z.date(),
});

// PUT replaces the whole assignee set at once (HU-31) — no per-user add/remove
// endpoint, so there's no "assign a single user" schema anymore.
export const replaceTaskAssigneesSchema = z.object({
  userIds: z.array(z.string().uuid()),
});

export type TaskAssignee = z.infer<typeof taskAssigneeSchema>;
export type ReplaceTaskAssigneesBody = z.infer<typeof replaceTaskAssigneesSchema>;

// Lean user summary embedded into task responses (backlog, sprint board, task
// detail) wherever a task's assignees are listed.
export type AssigneeSummary = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
};
