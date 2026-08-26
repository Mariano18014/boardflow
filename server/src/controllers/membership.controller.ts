import type { NextFunction, Request, Response } from "express";
import {
  listOrganizationMembersQuerySchema,
  updateMembershipRoleSchema,
  type ListOrganizationMembersQuery,
  type OrganizationMemberListItem,
  type UpdateMembershipRoleInput,
} from "@shared/schemas/membership.schema";
import { ValidationError } from "../lib/errors";
import {
  changeMemberRole,
  getOrganizationMembers,
  removeMemberFromOrganization,
} from "../services/membership.service";

export async function listOrganizationMembersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const pagination = parsePaginationQuery(req.query);
    const members = await getOrganizationMembers(organizationId, req.userId!, pagination);
    res.status(200).json({ members: members.map(formatMemberForResponse), pagination });
  } catch (error) {
    next(error);
  }
}

export async function changeMemberRoleController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const membershipId = parseMembershipIdParam(req.params.membershipId);
    const body = parseChangeMemberRoleRequestBody(req.body);
    const updatedMembership = await changeMemberRole(
      { organizationId, membershipId, newRoleId: body.roleId },
      req.userId!,
    );
    res.status(200).json({ membership: formatUpdatedMembershipForResponse(updatedMembership) });
  } catch (error) {
    next(error);
  }
}

export async function removeMemberController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const membershipId = parseMembershipIdParam(req.params.membershipId);
    const suspendedMembership = await removeMemberFromOrganization(
      { organizationId, membershipId },
      req.userId!,
    );
    res.status(200).json({ membership: formatSuspendedMembershipForResponse(suspendedMembership) });
  } catch (error) {
    next(error);
  }
}

function formatSuspendedMembershipForResponse(
  membership: Awaited<ReturnType<typeof removeMemberFromOrganization>>,
) {
  return {
    id: membership.id,
    roleId: membership.roleId,
    roleName: membership.role.name,
    status: membership.status,
  };
}

function parseOrganizationIdParam(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ organizationId: ["organizationId inválido."] });
  }
  return value;
}

function parseMembershipIdParam(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ membershipId: ["membershipId inválido."] });
  }
  return value;
}

function parseChangeMemberRoleRequestBody(body: unknown): UpdateMembershipRoleInput {
  const result = updateMembershipRoleSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function formatUpdatedMembershipForResponse(
  membership: Awaited<ReturnType<typeof changeMemberRole>>,
) {
  return {
    id: membership.id,
    roleId: membership.roleId,
    roleName: membership.role.name,
    status: membership.status,
  };
}

function parsePaginationQuery(query: unknown): ListOrganizationMembersQuery {
  const result = listOrganizationMembersQuerySchema.safeParse(query);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function formatMemberForResponse(member: OrganizationMemberListItem) {
  return {
    type: member.type,
    id: member.id,
    fullName: member.fullName,
    email: member.email,
    avatarUrl: member.avatarUrl,
    roleId: member.roleId,
    roleName: member.roleName,
    status: member.status,
    sortDate: member.sortDate,
  };
}
