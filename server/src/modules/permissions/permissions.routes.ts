import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { listPermissionsController } from "./permissions.controller";

export const permissionsRoutes = Router();

permissionsRoutes.get("/", authMiddleware, listPermissionsController);
