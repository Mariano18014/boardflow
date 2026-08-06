import { z } from "zod";
import { SPRINT_STATUS } from "../types/enums";

export const sprintSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string().min(1),
  goal: z.string().nullable(),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(SPRINT_STATUS),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createSprintSchema = sprintSchema
  .pick({ name: true, goal: true, startDate: true, endDate: true })
  .refine((data) => data.endDate > data.startDate, {
    message: "endDate debe ser posterior a startDate",
    path: ["endDate"],
  });

export const updateSprintSchema = sprintSchema
  .pick({ name: true, goal: true, startDate: true, endDate: true })
  .partial();

export type Sprint = z.infer<typeof sprintSchema>;
export type CreateSprintInput = z.infer<typeof createSprintSchema>;
export type UpdateSprintInput = z.infer<typeof updateSprintSchema>;
