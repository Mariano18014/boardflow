import { z } from "zod";
import { PLAN_TYPE } from "../types/enums";

export const organizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "El nombre es obligatorio.").max(100, "El nombre no puede superar los 100 caracteres."),
  slug: z.string().min(1),
  logoUrl: z.string().url().nullable(),
  planType: z.enum(PLAN_TYPE),
  ownerId: z.string().uuid(),
  settings: z.record(z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const createOrganizationSchema = organizationSchema.pick({ name: true });

export const updateOrganizationSchema = organizationSchema.pick({ name: true }).partial();

export type Organization = z.infer<typeof organizationSchema>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
