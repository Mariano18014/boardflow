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
