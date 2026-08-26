import type { CreateInvitationInput } from "@shared/schemas/invitation.schema";
import { env } from "../config/env";
import { ConflictError, ForbiddenError } from "../lib/errors";
import { parseDurationToMs } from "../lib/duration";
import { generateRandomToken } from "../lib/token";
import {
  findActiveMembershipByEmail,
  findMembershipForUser,
} from "../db/repositories/membership.repository";
import { findRoleById } from "../db/repositories/role.repository";
import {
  createInvitation as saveInvitationRecord,
  findPendingInvitationByEmail,
} from "../db/repositories/invitation.repository";
import { sendInvitationEmail as dispatchInvitationEmail } from "./email.service";

const INVITATION_TOKEN_TTL = "7d";
const OWNER_ROLE_NAME = "owner";

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
