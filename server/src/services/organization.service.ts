import type { Organization } from "@prisma/client";
import type { CreateOrganizationInput } from "@shared/schemas/organization.schema";
import { slugify } from "../lib/slug.util";
import { NotFoundError } from "../lib/errors";
import {
  createOrganization as saveOrganizationRecord,
  findOrganizationById as findOrganizationRecordById,
  findOrganizationBySlug,
  updateOrganization as updateOrganizationRecord,
} from "../db/repositories/organization.repository";
import { createMembership, findOrganizationsByUserId } from "../db/repositories/membership.repository";
import { createRole, createRolePermissions } from "../modules/roles/roles.repository";
import { findAllPermissions } from "../modules/permissions/permissions.repository";
import { checkRequesterHasPermission } from "../modules/permissions/check-permission";
import { deleteFile, saveFile, validateImageFile } from "./file-storage.service";

const OWNER_ROLE_NAME = "owner";
const OWNER_ROLE_DESCRIPTION = "Rol con acceso total a la organización.";
const MEMBER_ROLE_NAME = "member";
const MEMBER_ROLE_DESCRIPTION = "Rol estándar, sin permisos administrativos.";

const ORGANIZATION_LOGOS_SUBFOLDER = "organization-logos";

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

export type UpdateOrganizationRequest = {
  organizationId: string;
  name?: string;
  logoFile?: Express.Multer.File;
};

export async function updateOrganization(input: UpdateOrganizationRequest, requesterId: string) {
  await checkRequesterHasPermission(input.organizationId, requesterId, "organizations:edit");
  const organization = await findOrganizationById(input.organizationId);
  let logoUrl: string | undefined;
  if (input.logoFile) {
    await validateLogoFile(input.logoFile);
    logoUrl = await saveLogoFileToDisk(input.logoFile);
    await deleteOldLogoFile(organization.logoUrl);
  }
  const updatedOrganization = await saveOrganizationChanges(organization, {
    name: input.name,
    logoUrl,
  });
  return updatedOrganization;
}

async function findOrganizationById(organizationId: string): Promise<Organization> {
  const organization = await findOrganizationRecordById(organizationId);
  if (!organization) {
    throw new NotFoundError("La organización no existe.");
  }
  return organization;
}

async function validateLogoFile(file: Express.Multer.File) {
  validateImageFile(file, "logo");
}

async function saveLogoFileToDisk(file: Express.Multer.File): Promise<string> {
  return saveFile(ORGANIZATION_LOGOS_SUBFOLDER, {
    originalName: file.originalname,
    buffer: file.buffer,
  });
}

async function deleteOldLogoFile(currentLogoUrl: string | null) {
  if (!currentLogoUrl) {
    return;
  }
  await deleteFile(currentLogoUrl);
}

type OrganizationChanges = {
  name?: string;
  logoUrl?: string;
};

async function saveOrganizationChanges(
  organization: Organization,
  changes: OrganizationChanges,
): Promise<Organization> {
  // The slug is intentionally NOT recomputed here even though `name` can change.
  // It's immutable once the organization is created, by design, so existing
  // links/references to this org (e.g. invitation URLs, bookmarks) never break.
  return updateOrganizationRecord(organization.id, changes);
}
