import type { CreateOrganizationInput } from "@shared/schemas/organization.schema";
import { slugify } from "../lib/slug.util";
import { ForbiddenError } from "../lib/errors";
import {
  createOrganization as saveOrganizationRecord,
  findOrganizationBySlug,
} from "../db/repositories/organization.repository";
import {
  createMembership,
  findMembershipForUser,
  findOrganizationsByUserId,
} from "../db/repositories/membership.repository";
import { createRole, findRolesByOrganizationId } from "../db/repositories/role.repository";
import { findAllPermissions } from "../db/repositories/permission.repository";
import { createRolePermissions } from "../db/repositories/role-permission.repository";

const OWNER_ROLE_NAME = "owner";
const OWNER_ROLE_DESCRIPTION = "Rol con acceso total a la organización.";
const MEMBER_ROLE_NAME = "member";
const MEMBER_ROLE_DESCRIPTION = "Rol estándar, sin permisos administrativos.";

export async function createOrganization(input: CreateOrganizationInput, ownerId: string) {
  const slug = await generateUniqueSlug(input.name);
  const organization = await saveOrganizationInDatabase(input.name, slug, ownerId);
  await createOwnerMembership(organization.id, ownerId);
  await createDefaultMemberRole(organization.id);
  return organization;
}

async function generateUniqueSlug(name: string) {
  const baseSlug = slugify(name);
  let candidateSlug = baseSlug;
  let suffix = 1;
  while (!(await checkSlugAvailability(candidateSlug))) {
    suffix += 1;
    candidateSlug = `${baseSlug}-${suffix}`;
  }
  return candidateSlug;
}

async function checkSlugAvailability(slug: string): Promise<boolean> {
  const existingOrganization = await findOrganizationBySlug(slug);
  return existingOrganization === null;
}

async function saveOrganizationInDatabase(name: string, slug: string, ownerId: string) {
  return saveOrganizationRecord({ name, slug, ownerId });
}

async function createOwnerMembership(organizationId: string, userId: string) {
  const ownerRole = await createOwnerRole(organizationId);
  await saveMembershipInDatabase(userId, organizationId, ownerRole.id);
}

async function createOwnerRole(organizationId: string) {
  const role = await saveOwnerRoleInDatabase(organizationId);
  await assignAllPermissionsToRole(role.id);
  return role;
}

async function saveOwnerRoleInDatabase(organizationId: string) {
  return createRole({
    organizationId,
    name: OWNER_ROLE_NAME,
    isSystem: true,
    description: OWNER_ROLE_DESCRIPTION,
  });
}

async function assignAllPermissionsToRole(roleId: string) {
  const permissions = await findAllPermissions();
  const permissionIds = permissions.map((permission) => permission.id);
  await createRolePermissions(roleId, permissionIds);
}

async function saveMembershipInDatabase(userId: string, organizationId: string, roleId: string) {
  await createMembership({
    userId,
    organizationId,
    roleId,
    status: "ACTIVE",
    joinedAt: new Date(),
  });
}

// The "member" role has no permissions assigned yet — the granular permission
// matrix (assigning specific resource:action permissions to non-owner roles)
// ships in Epica 2 (HU-13/HU-14). For now it only exists so organizations have
// a non-owner role available to invite people into.
async function createDefaultMemberRole(organizationId: string) {
  return createRole({
    organizationId,
    name: MEMBER_ROLE_NAME,
    isSystem: true,
    description: MEMBER_ROLE_DESCRIPTION,
  });
}

export async function getOrganizationsForUser(userId: string) {
  return findOrganizationsByUserId(userId);
}

export async function getRolesForOrganization(organizationId: string, userId: string) {
  await validateUserIsMember(organizationId, userId);
  return findRolesByOrganizationId(organizationId);
}

async function validateUserIsMember(organizationId: string, userId: string) {
  const membership = await findMembershipForUser(organizationId, userId);
  if (!membership) {
    throw new ForbiddenError("No pertenecés a esta organización.");
  }
}
