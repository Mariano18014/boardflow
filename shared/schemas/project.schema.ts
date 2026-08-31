import { z } from "zod";
import { paginationQuerySchema } from "./pagination.schema";

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

export const listProjectsQuerySchema = paginationQuerySchema.extend({
  includeArchived: z.coerce.boolean().default(false),
});

export type Project = z.infer<typeof projectSchema>;
export type CreateProjectBody = z.infer<typeof createProjectBodySchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;

export type ProjectListItem = {
  id: string;
  name: string;
  key: string;
  description: string | null;
  isArchived: boolean;
  createdAt: Date;
  boardsCount: number;
};
