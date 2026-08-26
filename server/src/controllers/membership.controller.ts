import type { NextFunction, Request, Response } from "express";
import {
  listOrganizationMembersQuerySchema,
  type ListOrganizationMembersQuery,
  type OrganizationMemberListItem,
} from "@shared/schemas/membership.schema";
import { ValidationError } from "../lib/errors";
import { getOrganizationMembers } from "../services/membership.service";

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

function parseOrganizationIdParam(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ organizationId: ["organizationId inválido."] });
  }
  return value;
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
    roleName: member.roleName,
    status: member.status,
    sortDate: member.sortDate,
  };
}
