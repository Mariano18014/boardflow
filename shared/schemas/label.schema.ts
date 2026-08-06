import { z } from "zod";

export const labelSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string().min(1),
  color: z.string().min(1),
});

export const createLabelSchema = labelSchema.pick({ name: true, color: true });

export const updateLabelSchema = createLabelSchema.partial();

export type Label = z.infer<typeof labelSchema>;
export type CreateLabelInput = z.infer<typeof createLabelSchema>;
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>;
