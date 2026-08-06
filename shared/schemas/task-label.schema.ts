import { z } from "zod";

export const taskLabelSchema = z.object({
  taskId: z.string().uuid(),
  labelId: z.string().uuid(),
});

export type TaskLabel = z.infer<typeof taskLabelSchema>;
