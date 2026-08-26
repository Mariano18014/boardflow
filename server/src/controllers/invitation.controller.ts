import type { NextFunction, Request, Response } from "express";
import type { Invitation } from "@prisma/client";
import { createInvitationSchema, type CreateInvitationInput } from "@shared/schemas/invitation.schema";
import { ValidationError } from "../lib/errors";
import { inviteMemberToOrganization } from "../services/invitation.service";

export async function createInvitationController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const input = parseCreateInvitationRequestBody(req.body);
    const invitation = await inviteMemberToOrganization(input, organizationId, req.userId!);
    res.status(201).json({ invitation: formatInvitationForResponse(invitation) });
  } catch (error) {
    next(error);
  }
}

function parseOrganizationIdParam(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ organizationId: ["organizationId inválido."] });
  }
  return value;
}

function parseCreateInvitationRequestBody(body: unknown): CreateInvitationInput {
  const result = createInvitationSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function formatInvitationForResponse(invitation: Invitation) {
  return {
    id: invitation.id,
    email: invitation.email,
    roleId: invitation.roleId,
    status: invitation.status,
    expiresAt: invitation.expiresAt,
  };
}
