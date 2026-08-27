import { prisma } from "../../db/client";

export async function findAllPermissions() {
  return prisma.permission.findMany();
}

export async function findPermissionsByIds(ids: string[]) {
  return prisma.permission.findMany({ where: { id: { in: ids } } });
}
