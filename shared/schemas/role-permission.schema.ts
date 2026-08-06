import { z } from "zod";

export const rolePermissionSchema = z.object({
  id: z.string().uuid(),
  roleId: z.string().uuid(),
  permissionId: z.string().uuid(),
});

export type RolePermission = z.infer<typeof rolePermissionSchema>;
