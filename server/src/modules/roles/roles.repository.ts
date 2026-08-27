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
