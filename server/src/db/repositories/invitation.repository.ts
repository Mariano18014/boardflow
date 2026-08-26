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
