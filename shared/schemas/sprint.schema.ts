import { z } from "zod";
import { SPRINT_STATUS } from "../types/enums";

export const sprintSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string().min(1).max(100),
  goal: z.string().max(500).nullable(),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(SPRINT_STATUS),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createSprintBodySchema = z.object({
  name: z.string().min(1).max(100),
  goal: z.string().max(500).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const createSprintSchema = createSprintBodySchema.extend({
  organizationId: z.string().uuid(),
  projectId: z.string().uuid(),
});

export const updateSprintSchema = sprintSchema
  .pick({ name: true, goal: true, startDate: true, endDate: true })
  .partial();

export const listSprintsQuerySchema = z.object({
  status: z.enum(SPRINT_STATUS).optional(),
});

export type Sprint = z.infer<typeof sprintSchema>;
export type CreateSprintBody = z.infer<typeof createSprintBodySchema>;
export type CreateSprintInput = z.infer<typeof createSprintSchema>;
export type UpdateSprintInput = z.infer<typeof updateSprintSchema>;
export type ListSprintsQuery = z.infer<typeof listSprintsQuerySchema>;
