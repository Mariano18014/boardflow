import { Router } from "express";
import { getProjectController, listProjectsController } from "../controllers/project.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const projectRoutes = Router();

projectRoutes.get("/", authMiddleware, listProjectsController);
projectRoutes.get("/:projectId", authMiddleware, getProjectController);
