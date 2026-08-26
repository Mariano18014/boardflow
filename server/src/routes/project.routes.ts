import { Router } from "express";
import {
  createProjectController,
  getProjectController,
  listProjectsController,
} from "../controllers/project.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const projectRoutes = Router();

projectRoutes.post("/", authMiddleware, createProjectController);
projectRoutes.get("/", authMiddleware, listProjectsController);
projectRoutes.get("/:projectId", authMiddleware, getProjectController);
