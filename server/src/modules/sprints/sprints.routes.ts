import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createSprintController } from "./sprints.controller";

// mergeParams: true — this router is mounted at
// /organizations/:organizationId/projects/:projectId/sprints and needs access
// to the parent route's :organizationId and :projectId params.
export const sprintsRoutes = Router({ mergeParams: true });

sprintsRoutes.post("/", authMiddleware, createSprintController);
