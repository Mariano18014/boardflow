import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { listMyNotificationsController, markNotificationAsReadController } from "./notifications.controller";

export const notificationsRoutes = Router();

notificationsRoutes.get("/", authMiddleware, listMyNotificationsController);
notificationsRoutes.patch("/:notificationId/read", authMiddleware, markNotificationAsReadController);
