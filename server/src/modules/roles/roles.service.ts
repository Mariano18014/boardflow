import type { Role } from "@prisma/client";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "../../lib/errors";
import { findMembershipForUser } from "../../db/repositories/membership.repository";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import { findPermissionsByIds } from "../permissions/permissions.repository";
import {
  createRole as saveRoleRecord,
  findRoleByIdAndOrganizationId as findRoleRecordByIdAndOrganizationId,
  findRoleByName,
  findRolePermissionsByRoleId,
  findRolesByOrganizationId,
  replaceRolePermissions as replaceRolePermissionRecords,
} from "./roles.repository";

const OWNER_ROLE_NAME = "owner";
const RESERVED_ROLE_NAMES = ["owner", "member"];

export type CreateRoleRequest = {
  organizationId: string;
  name: string;
  description?: string | null;
};

export type ReplaceRolePermissionsInput = {
  organizationId: string;
  roleId: string;
  permissionIds: string[];
};

export async function getRolesForOrganization(organizationId: string, requesterId: string) {
  await checkRequesterBelongsToOrganization(organizationId, requesterId);
  return findRolesByOrganizationId(organizationId);
}

async function checkRequesterBelongsToOrganization(organizationId: string, requesterId: string) {
  const membership = await findMembershipForUser(organizationId, requesterId);
  if (!membership) {
    throw new ForbiddenError("No pertenecés a esta organización.");
  }
}

export async function createRole(input: CreateRoleRequest, requesterId: string) {
  await checkRequesterHasPermission(input.organizationId, requesterId, "roles:create");
  await checkRoleNameIsNotReserved(input.name);
  await checkRoleNameIsUnique(input.organizationId, input.name);
  const role = await saveRoleInDatabase(input);
  return role;
}

async function checkRoleNameIsNotReserved(name: string) {
  if (RESERVED_ROLE_NAMES.includes(name.toLowerCase())) {
    throw new ConflictError(`El nombre "${name}" está reservado para los roles del sistema.`);
  }
}

async function checkRoleNameIsUnique(organizationId: string, name: string) {
  const existingRole = await findRoleByName(organizationId, name);
  if (existingRole) {
    throw new ConflictError(`Ya existe un rol llamado "${name}" en esta organización.`);
  }
}

async function saveRoleInDatabase(input: CreateRoleRequest) {
  return saveRoleRecord({
    organizationId: input.organizationId,
    name: input.name,
    isSystem: false,
    description: input.description ?? null,
  });
}

export async function getRolePermissions(organizationId: string, roleId: string, requesterId: string) {
  await checkRequesterBelongsToOrganization(organizationId, requesterId);
  const role = await findRoleById(roleId, organizationId);
  const rolePermissions = await findRolePermissionsByRoleId(role.id);
  return rolePermissions.map((rolePermission) => rolePermission.permissionId);
}

export async function replaceRolePermissions(input: ReplaceRolePermissionsInput, requesterId: string) {
  await checkRequesterHasPermission(input.organizationId, requesterId, "roles:edit");
  const role = await findRoleById(input.roleId, input.organizationId);
  await checkRoleIsNotProtectedOwnerRole(role);
  await checkAllPermissionIdsExist(input.permissionIds);
  const updatedPermissions = await replacePermissionRecordsForRole(role.id, input.permissionIds);
  return updatedPermissions;
}

async function findRoleById(roleId: string, organizationId: string): Promise<Role> {
  const role = await findRoleRecordByIdAndOrganizationId(roleId, organizationId);
  if (!role) {
    throw new NotFoundError("El rol no existe en esta organización.");
  }
  return role;
}

async function checkRoleIsNotProtectedOwnerRole(role: Role) {
  if (role.name === OWNER_ROLE_NAME) {
    throw new ConflictError(
      'El rol "Owner" tiene acceso total implícito y no se gestiona asignándole permisos.',
    );
  }
}

async function checkAllPermissionIdsExist(permissionIds: string[]) {
  const existingPermissions = await findPermissionsByIds(permissionIds);
  const existingIds = new Set(existingPermissions.map((permission) => permission.id));
  const missingIds = permissionIds.filter((permissionId) => !existingIds.has(permissionId));
  if (missingIds.length > 0) {
    throw new ValidationError({
      permissionIds: [`Los siguientes permisos no existen: ${missingIds.join(", ")}`],
    });
  }
}

async function replacePermissionRecordsForRole(roleId: string, permissionIds: string[]) {
  return replaceRolePermissionRecords(roleId, permissionIds);
}
