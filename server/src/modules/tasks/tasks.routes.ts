import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createBacklogTaskController, getBacklogController } from "./backlog.controller";

// mergeParams: true — this router is mounted at
// /organizations/:organizationId/projects/:projectId and needs access to the
// parent route's :organizationId and :projectId params.
export const tasksRoutes = Router({ mergeParams: true });

tasksRoutes.get("/backlog", authMiddleware, getBacklogController);
tasksRoutes.post("/backlog/tasks", authMiddleware, createBacklogTaskController);
