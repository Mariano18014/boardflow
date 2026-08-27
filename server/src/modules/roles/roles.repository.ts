import { prisma } from "../../db/client";

type CreateRoleData = {
  organizationId: string;
  name: string;
  isSystem: boolean;
  description?: string | null;
};

export async function createRole(data: CreateRoleData) {
  return prisma.role.create({ data });
}

export async function findRolesByOrganizationId(organizationId: string) {
  return prisma.role.findMany({
    where: { organizationId },
    orderBy: { createdAt: "asc" },
  });
}

export async function findRoleById(id: string) {
  return prisma.role.findUnique({ where: { id } });
}

export async function findRoleByName(organizationId: string, name: string) {
  return prisma.role.findFirst({
    where: { organizationId, name: { equals: name, mode: "insensitive" } },
  });
}

export async function findRoleByIdAndOrganizationId(id: string, organizationId: string) {
  return prisma.role.findFirst({ where: { id, organizationId } });
}

export async function createRolePermissions(roleId: string, permissionIds: string[]) {
  return prisma.rolePermission.createMany({
    data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
  });
}

export async function findRolePermissionsByRoleId(roleId: string) {
  return prisma.rolePermission.findMany({ where: { roleId } });
}

export async function replaceRolePermissions(roleId: string, permissionIds: string[]) {
  return prisma.$transaction(async (tx) => {
    await tx.rolePermission.deleteMany({ where: { roleId } });
    if (permissionIds.length > 0) {
      await tx.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
      });
    }
    return tx.rolePermission.findMany({ where: { roleId } });
  });
}
