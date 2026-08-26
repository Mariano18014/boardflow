import { Router } from "express";
import {
  createOrganizationController,
  listOrganizationsController,
} from "../controllers/organization.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const organizationRoutes = Router();

organizationRoutes.post("/", authMiddleware, createOrganizationController);
organizationRoutes.get("/", authMiddleware, listOrganizationsController);
