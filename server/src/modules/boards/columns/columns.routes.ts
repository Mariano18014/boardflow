import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { updateColumnWipLimitController } from "./columns.controller";

// mergeParams: true — this router is mounted at
// /organizations/:organizationId/projects/:projectId/boards/columns and needs
// access to the parent routes' :organizationId and :projectId params.
export const columnsRoutes = Router({ mergeParams: true });

columnsRoutes.patch("/:columnId/wip-limit", authMiddleware, updateColumnWipLimitController);
