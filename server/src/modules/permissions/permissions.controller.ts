import type { NextFunction, Request, Response } from "express";
import type { Permission } from "@prisma/client";
import { ValidationError } from "../../lib/errors";
import { getMyPermissions, getPermissionCatalog } from "./permissions.service";

export async function listPermissionsController(req: Request, res: Response, next: NextFunction) {
  try {
    const permissions = await getPermissionCatalog();
    res.status(200).json({ permissions: permissions.map(formatPermissionForResponse) });
  } catch (error) {
    next(error);
  }
}

export async function getMyPermissionsController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const permissionKeys = await getMyPermissions(organizationId, req.userId!);
    res.status(200).json({ permissionKeys });
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

function formatPermissionForResponse(permission: Permission) {
  return {
    id: permission.id,
    resource: permission.resource,
    action: permission.action,
    key: permission.key,
  };
}
