import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  createRoleController,
  getRolePermissionsController,
  listRolesController,
  replaceRolePermissionsController,
} from "./roles.controller";

export const rolesRoutes = Router({ mergeParams: true });

rolesRoutes.get("/", authMiddleware, listRolesController);
rolesRoutes.post("/", authMiddleware, createRoleController);
rolesRoutes.get("/:roleId/permissions", authMiddleware, getRolePermissionsController);
rolesRoutes.put("/:roleId/permissions", authMiddleware, replaceRolePermissionsController);
