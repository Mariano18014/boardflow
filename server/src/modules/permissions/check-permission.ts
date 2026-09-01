import { ForbiddenError } from "../../lib/errors";
import { findMembershipForUser } from "../../db/repositories/membership.repository";
import { findRoleById, findRolePermissionByKey } from "../roles/roles.repository";

const OWNER_ROLE_NAME = "owner";

export async function checkRequesterHasPermission(
  organizationId: string,
  requesterId: string,
  permissionKey: string,
) {
  const membership = await findActiveMembership(organizationId, requesterId);
  const requesterIsOwner = await isOwnerRole(membership.roleId);
  if (requesterIsOwner) {
    return;
  }
  const hasPermission = await roleHasPermission(membership.roleId, permissionKey);
  if (!hasPermission) {
    throw new ForbiddenError(`No tenés permiso para realizar esta acción (${permissionKey}).`);
  }
}

export async function findActiveMembership(organizationId: string, requesterId: string) {
  const membership = await findMembershipForUser(organizationId, requesterId);
  if (!membership) {
    throw new ForbiddenError("No pertenecés a esta organización.");
  }
  return membership;
}

export async function isOwnerRole(roleId: string): Promise<boolean> {
  const role = await findRoleById(roleId);
  return role !== null && role.isSystem && role.name === OWNER_ROLE_NAME;
}

async function roleHasPermission(roleId: string, permissionKey: string): Promise<boolean> {
  const rolePermission = await findRolePermissionByKey(roleId, permissionKey);
  return rolePermission !== null;
}
