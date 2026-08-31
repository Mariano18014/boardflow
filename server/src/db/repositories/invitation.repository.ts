import type { InvitationStatus } from "@prisma/client";
import { prisma } from "../client";

type CreateInvitationData = {
  organizationId: string;
  email: string;
  roleId: string;
  token: string;
  invitedBy: string;
  expiresAt: Date;
};

export async function createInvitation(data: CreateInvitationData) {
  return prisma.invitation.create({ data });
}

export async function findPendingInvitationByEmail(organizationId: string, email: string) {
  return prisma.invitation.findFirst({
    where: { organizationId, email, status: "PENDING" },
  });
}

export async function findInvitationByToken(token: string) {
  return prisma.invitation.findUnique({
    where: { token },
    include: { organization: true, role: true },
  });
}

export async function updateInvitationStatus(id: string, status: InvitationStatus) {
  return prisma.invitation.update({ where: { id }, data: { status } });
}

export async function findPendingInvitationsByOrganizationId(organizationId: string) {
  return prisma.invitation.findMany({
    where: { organizationId, status: "PENDING" },
    include: { role: true },
    orderBy: { createdAt: "desc" },
  });
}
