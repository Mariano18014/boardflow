import type { NextFunction, Request, Response } from "express";
import type { Permission } from "@prisma/client";
import { getPermissionCatalog } from "./permissions.service";

export async function listPermissionsController(req: Request, res: Response, next: NextFunction) {
  try {
    const permissions = await getPermissionCatalog();
    res.status(200).json({ permissions: permissions.map(formatPermissionForResponse) });
  } catch (error) {
    next(error);
  }
}

function formatPermissionForResponse(permission: Permission) {
  return {
    id: permission.id,
    resource: permission.resource,
    action: permission.action,
    key: permission.key,
  };
}
