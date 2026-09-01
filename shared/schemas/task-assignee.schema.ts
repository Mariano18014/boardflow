import { z } from "zod";

export const taskAssigneeSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  userId: z.string().uuid(),
  assignedAt: z.date(),
});

export const replaceTaskAssigneesSchema = z.object({
  userIds: z.array(z.string().uuid()),
});

export type TaskAssignee = z.infer<typeof taskAssigneeSchema>;
export type ReplaceTaskAssigneesBody = z.infer<typeof replaceTaskAssigneesSchema>;

export type AssigneeSummary = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
};
