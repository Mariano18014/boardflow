import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  closeSprintController,
  createSprintController,
  listSprintsController,
  startSprintController,
} from "./sprints.controller";

// mergeParams: true — this router is mounted at
// /organizations/:organizationId/projects/:projectId/sprints and needs access
// to the parent route's :organizationId and :projectId params.
export const sprintsRoutes = Router({ mergeParams: true });

sprintsRoutes.post("/", authMiddleware, createSprintController);
sprintsRoutes.get("/", authMiddleware, listSprintsController);
sprintsRoutes.patch("/:sprintId/start", authMiddleware, startSprintController);
sprintsRoutes.patch("/:sprintId/close", authMiddleware, closeSprintController);
