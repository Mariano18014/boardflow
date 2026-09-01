import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createLabelController, listLabelsController } from "./labels.controller";

export const labelsRoutes = Router({ mergeParams: true });

labelsRoutes.post("/", authMiddleware, createLabelController);
labelsRoutes.get("/", authMiddleware, listLabelsController);
