import { z } from "zod";

export const taskLabelSchema = z.object({
  taskId: z.string().uuid(),
  labelId: z.string().uuid(),
});

export const replaceTaskLabelsSchema = z.object({
  labelIds: z.array(z.string().uuid()),
});

export type TaskLabel = z.infer<typeof taskLabelSchema>;
export type ReplaceTaskLabelsBody = z.infer<typeof replaceTaskLabelsSchema>;

export type LabelSummary = {
  id: string;
  name: string;
  color: string;
};
