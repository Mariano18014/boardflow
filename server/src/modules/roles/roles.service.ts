import { ConflictError, ForbiddenError } from "../../lib/errors";
import { findMembershipForUser } from "../../db/repositories/membership.repository";
import {
  createRole as saveRoleRecord,
  findRoleByName,
  findRoleById,
  findRolesByOrganizationId,
} from "./roles.repository";

const OWNER_ROLE_NAME = "owner";
const RESERVED_ROLE_NAMES = ["owner", "member"];

export type CreateRoleRequest = {
  organizationId: string;
  name: string;
  description?: string | null;
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
  await checkRequesterHasPermission(input.organizationId, requesterId);
  await checkRoleNameIsNotReserved(input.name);
  await checkRoleNameIsUnique(input.organizationId, input.name);
  const role = await saveRoleInDatabase(input);
  return role;
}

// TODO(HU-14): esta validación simplificada (solo el rol "owner" puede crear
// roles) es intencional hasta que HU-14 permita asignar el permiso granular
// "roles:create" a un rol — recién ahí se puede reemplazar este chequeo por uno
// real contra la matriz de permisos.
async function checkRequesterHasPermission(organizationId: string, requesterId: string) {
  const membership = await findMembershipForUser(organizationId, requesterId);
  const role = membership ? await findRoleById(membership.roleId) : null;
  if (!role || role.name !== OWNER_ROLE_NAME) {
    throw new ForbiddenError("No tenés permiso para crear roles en esta organización.");
  }
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
