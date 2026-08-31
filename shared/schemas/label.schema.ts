import { z } from "zod";

// A label's name is a short tag, not a task title — 50 chars is plenty and
// keeps it readable as a chip in the UI.
const LABEL_NAME_MAX_LENGTH = 50;

export const labelSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string().min(1).max(LABEL_NAME_MAX_LENGTH),
  // Deliberately loose here (non-empty string, not the hex format itself):
  // the semantic "is this actually a 6-digit hex color" check lives in
  // labels.service.ts's checkColorFormatIsValid, mirroring how
  // columns.service.ts's validateWipLimitValue keeps its schema structural
  // and its business rule in the service.
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
