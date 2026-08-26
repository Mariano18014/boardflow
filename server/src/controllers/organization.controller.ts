import type { NextFunction, Request, Response } from "express";
import type { Organization, Role } from "@prisma/client";
import {
  createOrganizationSchema,
  updateOrganizationSchema,
  type CreateOrganizationInput,
  type UpdateOrganizationInput,
} from "@shared/schemas/organization.schema";
import { ValidationError } from "../lib/errors";
import {
  createOrganization,
  getOrganizationsForUser,
  getRolesForOrganization,
  updateOrganization,
} from "../services/organization.service";

export async function createOrganizationController(req: Request, res: Response, next: NextFunction) {
  try {
    const input = parseCreateOrganizationRequestBody(req.body);
    const organization = await createOrganization(input, req.userId!);
    res.status(201).json({ organization: formatOrganizationForResponse(organization) });
  } catch (error) {
    next(error);
  }
}

export async function listOrganizationsController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizations = await getOrganizationsForUser(req.userId!);
    res.status(200).json({ organizations: organizations.map(formatOrganizationForResponse) });
  } catch (error) {
    next(error);
  }
}

export async function listRolesController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const roles = await getRolesForOrganization(organizationId, req.userId!);
    res.status(200).json({ roles: roles.map(formatRoleForResponse) });
  } catch (error) {
    next(error);
  }
}

export async function updateOrganizationController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const body = parseUpdateOrganizationRequestBody(req.body);
    const updatedOrganization = await updateOrganization(
      { organizationId, name: body.name, logoFile: req.file },
      req.userId!,
    );
    res.status(200).json({ organization: formatOrganizationForResponse(updatedOrganization) });
  } catch (error) {
    next(error);
  }
}

function parseCreateOrganizationRequestBody(body: unknown): CreateOrganizationInput {
  const result = createOrganizationSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function parseUpdateOrganizationRequestBody(body: unknown): UpdateOrganizationInput {
  const result = updateOrganizationSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function parseOrganizationIdParam(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ organizationId: ["organizationId inválido."] });
  }
  return value;
}

function formatOrganizationForResponse(organization: Organization & { roleName?: string }) {
  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    logoUrl: organization.logoUrl,
    ...(organization.roleName ? { roleName: organization.roleName } : {}),
  };
}

function formatRoleForResponse(role: Role) {
  return {
    id: role.id,
    name: role.name,
  };
}
