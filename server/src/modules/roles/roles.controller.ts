import type { NextFunction, Request, Response } from "express";
import type { Role, RolePermission } from "@prisma/client";
import {
  assignRolePermissionsSchema,
  createRoleSchema,
  type AssignRolePermissionsInput,
  type CreateRoleInput,
} from "@shared/schemas/role.schema";
import { ValidationError } from "../../lib/errors";
import {
  createRole,
  getRolePermissions,
  getRolesForOrganization,
  replaceRolePermissions,
} from "./roles.service";

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

export async function getRolePermissionsController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const roleId = parseRoleIdParam(req.params.roleId);
    const permissionIds = await getRolePermissions(organizationId, roleId, req.userId!);
    res.status(200).json({ permissionIds });
  } catch (error) {
    next(error);
  }
}

export async function replaceRolePermissionsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const roleId = parseRoleIdParam(req.params.roleId);
    const body = parseReplaceRolePermissionsRequestBody(req.body);
    const updatedPermissions = await replaceRolePermissions(
      { organizationId, roleId, permissionIds: body.permissionIds },
      req.userId!,
    );
    res.status(200).json({ permissionIds: updatedPermissions.map(formatPermissionIdFromRolePermission) });
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

function parseRoleIdParam(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ roleId: ["roleId inválido."] });
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

function parseReplaceRolePermissionsRequestBody(body: unknown): AssignRolePermissionsInput {
  const result = assignRolePermissionsSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function formatPermissionIdFromRolePermission(rolePermission: RolePermission): string {
  return rolePermission.permissionId;
}

function formatRoleForResponse(role: Role) {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    isSystem: role.isSystem,
  };
}
