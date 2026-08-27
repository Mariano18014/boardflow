import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createBoardController } from "./boards.controller";

// mergeParams: true — this router is mounted at
// /organizations/:organizationId/projects/:projectId/boards and needs access
// to the parent route's :organizationId and :projectId params.
export const boardsRoutes = Router({ mergeParams: true });

boardsRoutes.post("/", authMiddleware, createBoardController);
