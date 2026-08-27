import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createRoleController, listRolesController } from "./roles.controller";

// mergeParams: true — this router is mounted at /organizations/:organizationId/roles
// and needs access to the parent route's :organizationId param.
export const rolesRoutes = Router({ mergeParams: true });

rolesRoutes.get("/", authMiddleware, listRolesController);
rolesRoutes.post("/", authMiddleware, createRoleController);
