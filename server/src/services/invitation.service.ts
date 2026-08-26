import type { Invitation, Organization, Role } from "@prisma/client";
import type { CreateInvitationInput } from "@shared/schemas/invitation.schema";
import { env } from "../config/env";
import { ConflictError, ForbiddenError, NotFoundError } from "../lib/errors";
import { parseDurationToMs } from "../lib/duration";
import { generateRandomToken } from "../lib/token";
import {
  createMembership,
  findActiveMembershipByEmail,
  findMembershipForUser,
} from "../db/repositories/membership.repository";
import { findRoleById } from "../db/repositories/role.repository";
import { findUserById } from "../db/repositories/user.repository";
import {
  createInvitation as saveInvitationRecord,
  findInvitationByToken as findInvitationRecordByToken,
  findPendingInvitationByEmail,
  updateInvitationStatus,
} from "../db/repositories/invitation.repository";
import { sendInvitationEmail as dispatchInvitationEmail } from "./email.service";

const INVITATION_TOKEN_TTL = "7d";
const OWNER_ROLE_NAME = "owner";

type InvitationWithRelations = Invitation & { organization: Organization; role: Role };

export type InvitationDetails = {
  organizationName: string;
  email: string;
  roleName: string;
};

export async function inviteMemberToOrganization(
  input: CreateInvitationInput,
  organizationId: string,
  inviterId: string,
) {
  await checkInviterHasPermission(organizationId, inviterId);
  await checkEmailIsNotAlreadyMember(organizationId, input.email);
  await checkNoDuplicatePendingInvitation(organizationId, input.email);
  const invitation = await createInvitationRecord(input, organizationId, inviterId);
  await sendInvitationEmail(invitation);
  return invitation;
}

// TODO(Epica 2 / HU-13-HU-14): reemplazar esta validación simplificada por el
// chequeo real contra la matriz de permisos granular (ej. "invitations:create")
// una vez que existan roles custom y permisos asignables por rol.
async function checkInviterHasPermission(organizationId: string, inviterId: string) {
  const membership = await findMembershipForUser(organizationId, inviterId);
  const role = membership ? await findRoleById(membership.roleId) : null;
  if (!role || role.name !== OWNER_ROLE_NAME) {
    throw new ForbiddenError("No tenés permiso para invitar miembros a esta organización.");
  }
}

async function checkEmailIsNotAlreadyMember(organizationId: string, email: string) {
  const existingMember = await findActiveMembershipByEmail(organizationId, email);
  if (existingMember) {
    throw new ConflictError("Ese email ya pertenece a un miembro de la organización.");
  }
}

async function checkNoDuplicatePendingInvitation(organizationId: string, email: string) {
  const existingInvitation = await findPendingInvitationByEmail(organizationId, email);
  if (existingInvitation) {
    throw new ConflictError("Ya existe una invitación pendiente para ese email.");
  }
}

async function createInvitationRecord(
  input: CreateInvitationInput,
  organizationId: string,
  inviterId: string,
) {
  const token = generateInvitationToken();
  const expiresAt = calculateInvitationExpiry();
  return saveInvitationInDatabase(input, organizationId, inviterId, token, expiresAt);
}

function generateInvitationToken() {
  return generateRandomToken();
}

function calculateInvitationExpiry() {
  return new Date(Date.now() + parseDurationToMs(INVITATION_TOKEN_TTL));
}

async function saveInvitationInDatabase(
  input: CreateInvitationInput,
  organizationId: string,
  inviterId: string,
  token: string,
  expiresAt: Date,
) {
  return saveInvitationRecord({
    organizationId,
    email: input.email,
    roleId: input.roleId,
    token,
    invitedBy: inviterId,
    expiresAt,
  });
}

async function sendInvitationEmail(invitation: { email: string; token: string }) {
  const invitationUrl = buildInvitationUrl(invitation.token);
  await dispatchInvitationEmail(invitation.email, invitationUrl);
}

function buildInvitationUrl(token: string) {
  return `${env.APP_URL}/invitations/accept?token=${token}`;
}

export async function getInvitationDetails(token: string): Promise<InvitationDetails> {
  const invitation = await findInvitationByToken(token);
  await checkInvitationIsStillValid(invitation);
  return mapInvitationToPublicDetails(invitation);
}

export async function acceptInvitation(token: string, authenticatedUserId: string) {
  const invitation = await findInvitationByToken(token);
  await checkInvitationIsStillValid(invitation);
  await checkInvitationEmailMatchesUser(invitation, authenticatedUserId);
  const membership = await createMembershipFromInvitation(invitation, authenticatedUserId);
  await markInvitationAsAccepted(invitation);
  return membership;
}

async function findInvitationByToken(token: string): Promise<InvitationWithRelations> {
  const invitation = await findInvitationRecordByToken(token);
  if (!invitation) {
    throw new NotFoundError("Invitación no encontrada.");
  }
  return invitation;
}

async function checkInvitationIsStillValid(invitation: Invitation) {
  if (invitation.status === "ACCEPTED") {
    throw new ConflictError("Esta invitación ya fue aceptada.");
  }
  if (invitation.status === "REVOKED") {
    throw new ConflictError("Esta invitación fue revocada.");
  }
  if (invitation.status === "EXPIRED") {
    throw new ConflictError("Esta invitación expiró. Pedí una invitación nueva.");
  }
  if (checkInvitationIsExpired(invitation)) {
    await markInvitationAsExpired(invitation);
    throw new ConflictError("Esta invitación expiró. Pedí una invitación nueva.");
  }
}

function checkInvitationIsExpired(invitation: Invitation): boolean {
  return invitation.expiresAt.getTime() < Date.now();
}

async function checkInvitationEmailMatchesUser(invitation: Invitation, userId: string) {
  const user = await findUserById(userId);
  const invitationEmailMatchesUser =
    user !== null && user.email.toLowerCase() === invitation.email.toLowerCase();
  if (!invitationEmailMatchesUser) {
    throw new ForbiddenError("Esta invitación fue enviada a otro email.");
  }
}

async function createMembershipFromInvitation(invitation: Invitation, userId: string) {
  return createMembership({
    userId,
    organizationId: invitation.organizationId,
    roleId: invitation.roleId,
    status: "ACTIVE",
    joinedAt: new Date(),
  });
}

async function markInvitationAsAccepted(invitation: Invitation) {
  await updateInvitationStatus(invitation.id, "ACCEPTED");
}

async function markInvitationAsExpired(invitation: Invitation) {
  await updateInvitationStatus(invitation.id, "EXPIRED");
}

function mapInvitationToPublicDetails(invitation: InvitationWithRelations): InvitationDetails {
  return {
    organizationName: invitation.organization.name,
    email: invitation.email,
    roleName: invitation.role.name,
  };
}
