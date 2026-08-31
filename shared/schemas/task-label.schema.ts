import { z } from "zod";

export const taskLabelSchema = z.object({
  taskId: z.string().uuid(),
  labelId: z.string().uuid(),
});

// PUT replaces the whole label set at once (HU-37), same "total replacement"
// criterion as replaceTaskAssigneesSchema (HU-31) — no per-label add/remove
// endpoint.
export const replaceTaskLabelsSchema = z.object({
  labelIds: z.array(z.string().uuid()),
});

export type TaskLabel = z.infer<typeof taskLabelSchema>;
export type ReplaceTaskLabelsBody = z.infer<typeof replaceTaskLabelsSchema>;

// Lean label summary embedded into task responses (backlog, sprint board,
// task detail) wherever a task's labels are listed.
export type LabelSummary = {
  id: string;
  name: string;
  color: string;
};
