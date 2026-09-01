import { z } from "zod";

const LABEL_NAME_MAX_LENGTH = 50;

export const labelSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string().min(1).max(LABEL_NAME_MAX_LENGTH),

  color: z.string().min(1),
});

export const createLabelBodySchema = labelSchema.pick({ name: true, color: true });

export const createLabelSchema = createLabelBodySchema.extend({
  organizationId: z.string().uuid(),
  projectId: z.string().uuid(),
});

export const updateLabelSchema = createLabelBodySchema.partial();

export type Label = z.infer<typeof labelSchema>;
export type CreateLabelBody = z.infer<typeof createLabelBodySchema>;
export type CreateLabelInput = z.infer<typeof createLabelSchema>;
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>;
