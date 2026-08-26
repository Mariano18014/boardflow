import { prisma } from "../client";

export async function createRolePermissions(roleId: string, permissionIds: string[]) {
  return prisma.rolePermission.createMany({
    data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
  });
}
