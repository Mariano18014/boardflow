import { prisma } from "../client";

type CreateRoleData = {
  organizationId: string;
  name: string;
  isSystem: boolean;
  description?: string;
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
