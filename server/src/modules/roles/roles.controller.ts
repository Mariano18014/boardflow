import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";
import { createRoleSchema, type CreateRoleInput } from "@shared/schemas/role.schema";
import { ValidationError } from "../../lib/errors";
import { createRole, getRolesForOrganization } from "./roles.service";

export async function listRolesController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const roles = await getRolesForOrganization(organizationId, req.userId!);
    res.status(200).json({ roles: roles.map(formatRoleForResponse) });
  } catch (error) {
    next(error);
  }
}

export async function createRoleController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const body = parseCreateRoleRequestBody(req.body);
    const role = await createRole(
      { organizationId, name: body.name, description: body.description },
      req.userId!,
    );
    res.status(201).json({ role: formatRoleForResponse(role) });
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

function parseCreateRoleRequestBody(body: unknown): CreateRoleInput {
  const result = createRoleSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function formatRoleForResponse(role: Role) {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    isSystem: role.isSystem,
  };
}
