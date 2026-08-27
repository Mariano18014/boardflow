import type { Invitation, Membership, Role, User } from "@prisma/client";
import type { OrganizationMemberListItem } from "@shared/schemas/membership.schema";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "../lib/errors";
import {
  countActiveMembershipsByRoleName,
  findMembershipById as findMembershipRecordById,
  findMembershipForUser,
  findMembershipsByOrganizationId,
  suspendMembership as saveSuspendedMembership,
  updateMembershipRole as saveMembershipRole,
} from "../db/repositories/membership.repository";
import { findPendingInvitationsByOrganizationId } from "../db/repositories/invitation.repository";
import { findRoleById } from "../modules/roles/roles.repository";

const OWNER_ROLE_NAME = "owner";

type Pagination = { limit: number; offset: number };

type MembershipWithRelations = Membership & { user: User; role: Role };
type MembershipWithRole = Membership & { role: Role };
type InvitationWithRole = Invitation & { role: Role };

export type ChangeMemberRoleInput = {
  organizationId: string;
  membershipId: string;
  newRoleId: string;
};

export type RemoveMemberInput = {
  organizationId: string;
  membershipId: string;
};

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
    roleId: membership.role.id,
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
    roleId: invitation.role.id,
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

export async function changeMemberRole(input: ChangeMemberRoleInput, requesterId: string) {
  await checkRequesterHasPermission(input.organizationId, requesterId);
  const targetMembership = await findMembershipById(input.membershipId, input.organizationId);
  await checkNotChangingOwnRole(targetMembership, requesterId);
  await checkRoleBelongsToOrganization(input.newRoleId, input.organizationId);
  await checkRoleChangeDoesNotRemoveLastOwner(targetMembership, input.newRoleId);
  const updatedMembership = await updateMembershipRole(targetMembership, input.newRoleId);
  return updatedMembership;
}

export async function removeMemberFromOrganization(input: RemoveMemberInput, requesterId: string) {
  await checkRequesterHasPermission(input.organizationId, requesterId);
  const targetMembership = await findMembershipById(input.membershipId, input.organizationId);
  await checkNotRemovingSelf(targetMembership, requesterId);
  await checkNotRemovingLastOwner(targetMembership);
  const suspendedMembership = await suspendMembership(targetMembership);
  return suspendedMembership;
}

// TODO(Epica 2 / HU-13-HU-14): reemplazar esta validación simplificada por el
// chequeo real contra la matriz de permisos granular (ej. "members:update-role",
// "members:remove") una vez que existan roles custom y permisos asignables por rol.
async function checkRequesterHasPermission(organizationId: string, requesterId: string) {
  const membership = await findMembershipForUser(organizationId, requesterId);
  const role = membership ? await findRoleById(membership.roleId) : null;
  if (!role || role.name !== OWNER_ROLE_NAME) {
    throw new ForbiddenError("No tenés permiso para gestionar los miembros de esta organización.");
  }
}

async function findMembershipById(
  membershipId: string,
  organizationId: string,
): Promise<MembershipWithRole> {
  const membership = await findMembershipRecordById(membershipId, organizationId);
  if (!membership) {
    throw new NotFoundError("La membership no existe en esta organización.");
  }
  return membership;
}

async function checkNotChangingOwnRole(membership: MembershipWithRole, requesterId: string) {
  if (membership.userId === requesterId) {
    throw new ForbiddenError("No podés cambiar tu propio rol. Pedile a otro owner que lo haga.");
  }
}

async function checkRoleBelongsToOrganization(roleId: string, organizationId: string) {
  const role = await findRoleById(roleId);
  if (!role || role.organizationId !== organizationId) {
    throw new ValidationError({ roleId: ["El rol seleccionado no pertenece a esta organización."] });
  }
}

async function checkRoleChangeDoesNotRemoveLastOwner(membership: MembershipWithRole, newRoleId: string) {
  const isTargetCurrentlyOwner = membership.role.name === OWNER_ROLE_NAME;
  if (!isTargetCurrentlyOwner) {
    return;
  }
  const newRole = await findRoleById(newRoleId);
  const isStayingOwner = newRole?.name === OWNER_ROLE_NAME;
  if (isStayingOwner) {
    return;
  }
  await checkTargetIsNotTheLastActiveOwner(membership);
}

async function checkNotRemovingSelf(membership: MembershipWithRole, requesterId: string) {
  if (membership.userId === requesterId) {
    throw new ForbiddenError(
      "No podés removerte a vos mismo de la organización. Pedile a otro owner que lo haga.",
    );
  }
}

async function checkNotRemovingLastOwner(membership: MembershipWithRole) {
  const isTargetCurrentlyOwner = membership.role.name === OWNER_ROLE_NAME;
  if (!isTargetCurrentlyOwner) {
    return;
  }
  await checkTargetIsNotTheLastActiveOwner(membership);
}

async function checkTargetIsNotTheLastActiveOwner(membership: MembershipWithRole) {
  const activeOwnerCount = await countActiveOwners(membership.organizationId);
  if (activeOwnerCount <= 1) {
    throw new ConflictError("La organización debe tener al menos un owner activo.");
  }
}

async function countActiveOwners(organizationId: string): Promise<number> {
  return countActiveMembershipsByRoleName(organizationId, OWNER_ROLE_NAME);
}

async function updateMembershipRole(
  membership: MembershipWithRole,
  newRoleId: string,
): Promise<MembershipWithRole> {
  return saveMembershipRole(membership.id, newRoleId);
}

async function suspendMembership(membership: MembershipWithRole): Promise<MembershipWithRole> {
  return saveSuspendedMembership(membership.id);
}
