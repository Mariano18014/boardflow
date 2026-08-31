import { z } from "zod";

export const roleSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  name: z.string().min(1, "El nombre es obligatorio.").max(50, "El nombre no puede superar los 50 caracteres."),
  isSystem: z.boolean(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createRoleSchema = z.object({
  name: roleSchema.shape.name,
  description: roleSchema.shape.description.optional(),
});

export const updateRoleSchema = createRoleSchema.partial();

export const assignRolePermissionsSchema = z.object({
  permissionIds: z.array(z.string().uuid()),
});

export type Role = z.infer<typeof roleSchema>;
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type AssignRolePermissionsInput = z.infer<typeof assignRolePermissionsSchema>;
