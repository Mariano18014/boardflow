import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getActivityLogController } from "./activity-log.controller";

export const activityLogRoutes = Router({ mergeParams: true });

activityLogRoutes.get("/", authMiddleware, getActivityLogController);
