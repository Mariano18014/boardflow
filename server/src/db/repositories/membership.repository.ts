import type { MembershipStatus } from "@prisma/client";
import { prisma } from "../client";

type CreateMembershipData = {
  userId: string;
  organizationId: string;
  roleId: string;
  status: MembershipStatus;
  joinedAt: Date;
};

export async function createMembership(data: CreateMembershipData) {
  return prisma.membership.create({ data });
}

export async function findOrganizationsByUserId(userId: string) {
  const memberships = await prisma.membership.findMany({
    where: { userId },
    include: { organization: true },
  });
  return memberships.map((membership) => membership.organization);
}

export async function findMembershipForUser(organizationId: string, userId: string) {
  return prisma.membership.findUnique({
    where: { userId_organizationId: { userId, organizationId } },
  });
}
