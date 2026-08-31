import { findRolePermissionKeys } from "../roles/roles.repository";
import { findActiveMembership, isOwnerRole } from "./check-permission";
import { findAllPermissions } from "./permissions.repository";

export async function getPermissionCatalog() {
  return findAllPermissions();
}

export async function getMyPermissions(organizationId: string, requesterId: string): Promise<string[]> {
  const membership = await findActiveMembership(organizationId, requesterId);
  const requesterIsOwner = await isOwnerRole(membership.roleId);
  if (requesterIsOwner) {
    return getAllPermissionKeys();
  }
  return getRolePermissionKeys(membership.roleId);
}

async function getAllPermissionKeys(): Promise<string[]> {
  const permissions = await findAllPermissions();
  return permissions.map((permission) => permission.key);
}

async function getRolePermissionKeys(roleId: string): Promise<string[]> {
  return findRolePermissionKeys(roleId);
}
