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
    where: { userId, status: "ACTIVE" },
    include: { organization: true, role: true },
  });
  return memberships.map((membership) => ({
    ...membership.organization,
    roleName: membership.role.name,
  }));
}

export async function findMembershipForUser(organizationId: string, userId: string) {
  return prisma.membership.findUnique({
    where: { userId_organizationId: { userId, organizationId }, status: "ACTIVE" },
  });
}

// Bulk variant of findMembershipForUser, for callers that need to check that
// every id in a list (e.g. task assignees) belongs to an active membership,
// without looping a single-user lookup per id.
export async function findActiveMembershipsByUserIds(organizationId: string, userIds: string[]) {
  return prisma.membership.findMany({
    where: { organizationId, userId: { in: userIds }, status: "ACTIVE" },
  });
}

export async function findActiveMembershipByEmail(organizationId: string, email: string) {
  return prisma.membership.findFirst({
    where: {
      organizationId,
      status: "ACTIVE",
      user: { email },
    },
  });
}

type Pagination = { limit: number; offset: number };

export async function findMembershipsByOrganizationId(
  organizationId: string,
  pagination: Pagination,
) {
  return prisma.membership.findMany({
    where: { organizationId },
    include: { user: true, role: true },
    orderBy: { joinedAt: "desc" },
    take: pagination.limit,
    skip: pagination.offset,
  });
}

export async function findMembershipById(membershipId: string, organizationId: string) {
  return prisma.membership.findFirst({
    where: { id: membershipId, organizationId },
    include: { role: true },
  });
}

export async function updateMembershipRole(membershipId: string, roleId: string) {
  return prisma.membership.update({
    where: { id: membershipId },
    data: { roleId },
    include: { role: true },
  });
}

export async function countActiveMembershipsByRoleName(organizationId: string, roleName: string) {
  return prisma.membership.count({
    where: { organizationId, status: "ACTIVE", role: { name: roleName } },
  });
}

export async function suspendMembership(membershipId: string) {
  return prisma.membership.update({
    where: { id: membershipId },
    data: { status: "SUSPENDED" },
    include: { role: true },
  });
}
