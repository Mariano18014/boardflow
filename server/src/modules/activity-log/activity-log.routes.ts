import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getActivityLogController } from "./activity-log.controller";

// mergeParams: true — mounted at /organizations/:organizationId/activity-log
// and needs access to the parent route's :organizationId param.
export const activityLogRoutes = Router({ mergeParams: true });

activityLogRoutes.get("/", authMiddleware, getActivityLogController);
