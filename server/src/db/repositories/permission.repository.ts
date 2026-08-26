import { prisma } from "../client";

export async function findAllPermissions() {
  return prisma.permission.findMany();
}
