import type { Invitation, Membership, Role, User } from "@prisma/client";
import type { OrganizationMemberListItem } from "@shared/schemas/membership.schema";
import { ForbiddenError } from "../lib/errors";
import {
  findMembershipForUser,
  findMembershipsByOrganizationId,
} from "../db/repositories/membership.repository";
import { findPendingInvitationsByOrganizationId } from "../db/repositories/invitation.repository";

type Pagination = { limit: number; offset: number };

type MembershipWithRelations = Membership & { user: User; role: Role };
type InvitationWithRole = Invitation & { role: Role };

export async function getOrganizationMembers(
  organizationId: string,
  requesterId: string,
  pagination: Pagination,
): Promise<OrganizationMemberListItem[]> {
  await checkRequesterBelongsToOrganization(organizationId, requesterId);
  const activeMembers = await findActiveMemberships(organizationId, pagination);
  const pendingInvitations = await findPendingInvitations(organizationId);
  const memberList = mergeMembersAndInvitations(activeMembers, pendingInvitations);
  return memberList;
}

async function checkRequesterBelongsToOrganization(organizationId: string, requesterId: string) {
  const membership = await findMembershipForUser(organizationId, requesterId);
  if (!membership) {
    throw new ForbiddenError("No pertenecés a esta organización.");
  }
}

async function findActiveMemberships(
  organizationId: string,
  pagination: Pagination,
): Promise<MembershipWithRelations[]> {
  return findMembershipsByOrganizationId(organizationId, pagination);
}

async function findPendingInvitations(organizationId: string): Promise<InvitationWithRole[]> {
  return findPendingInvitationsByOrganizationId(organizationId);
}

function mergeMembersAndInvitations(
  members: MembershipWithRelations[],
  invitations: InvitationWithRole[],
): OrganizationMemberListItem[] {
  const memberItems = members.map(mapMembershipToListItem);
  const invitationItems = invitations.map(mapInvitationToListItem);
  return sortMemberListByDateDescending([...memberItems, ...invitationItems]);
}

function mapMembershipToListItem(membership: MembershipWithRelations): OrganizationMemberListItem {
  return {
    type: "member",
    id: membership.id,
    fullName: membership.user.fullName,
    email: membership.user.email,
    avatarUrl: membership.user.avatarUrl,
    roleName: membership.role.name,
    status: membership.status,
    sortDate: membership.joinedAt ?? membership.createdAt,
  };
}

function mapInvitationToListItem(invitation: InvitationWithRole): OrganizationMemberListItem {
  return {
    type: "invitation",
    id: invitation.id,
    fullName: null,
    email: invitation.email,
    avatarUrl: null,
    roleName: invitation.role.name,
    status: "PENDING",
    sortDate: invitation.createdAt,
  };
}

function sortMemberListByDateDescending(
  items: OrganizationMemberListItem[],
): OrganizationMemberListItem[] {
  return [...items].sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());
}
