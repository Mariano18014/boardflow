import { z } from "zod";

export const projectSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  name: z.string().min(1).max(100),
  key: z.string().min(2).max(5),
  description: z.string().nullable(),
  isArchived: z.boolean(),
  createdBy: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const createProjectBodySchema = projectSchema.pick({ name: true }).extend({
  description: z.string().max(500).optional(),
});

export const createProjectSchema = createProjectBodySchema.extend({
  organizationId: z.string().uuid(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type Project = z.infer<typeof projectSchema>;
export type CreateProjectBody = z.infer<typeof createProjectBodySchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
