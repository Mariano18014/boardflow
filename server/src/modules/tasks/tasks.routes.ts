import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  createBacklogTaskController,
  getBacklogController,
  reorderBacklogTasksController,
} from "./backlog.controller";
import { getTaskDetailController, updateTaskDetailsController } from "./task-detail.controller";
import { replaceTaskAssigneesController } from "./assignees/assignees.controller";
import { replaceTaskLabelsController } from "./labels/labels.controller";

// mergeParams: true — this router is mounted at
// /organizations/:organizationId/projects/:projectId and needs access to the
// parent route's :organizationId and :projectId params.
export const tasksRoutes = Router({ mergeParams: true });

tasksRoutes.get("/backlog", authMiddleware, getBacklogController);
tasksRoutes.post("/backlog/tasks", authMiddleware, createBacklogTaskController);
tasksRoutes.patch("/backlog/reorder", authMiddleware, reorderBacklogTasksController);
tasksRoutes.get("/tasks/:taskId", authMiddleware, getTaskDetailController);
tasksRoutes.patch("/tasks/:taskId", authMiddleware, updateTaskDetailsController);
tasksRoutes.put("/tasks/:taskId/assignees", authMiddleware, replaceTaskAssigneesController);
tasksRoutes.put("/tasks/:taskId/labels", authMiddleware, replaceTaskLabelsController);
