import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createLabelController, listLabelsController } from "./labels.controller";

// mergeParams: true — this router is mounted at
// /organizations/:organizationId/projects/:projectId/labels and needs access
// to the parent route's :organizationId and :projectId params.
export const labelsRoutes = Router({ mergeParams: true });

labelsRoutes.post("/", authMiddleware, createLabelController);
labelsRoutes.get("/", authMiddleware, listLabelsController);
