import { Router } from "express";
import {
  createOrganizationController,
  listOrganizationsController,
  listRolesController,
} from "../controllers/organization.controller";
import { createInvitationController } from "../controllers/invitation.controller";
import {
  changeMemberRoleController,
  listOrganizationMembersController,
} from "../controllers/membership.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const organizationRoutes = Router();

organizationRoutes.post("/", authMiddleware, createOrganizationController);
organizationRoutes.get("/", authMiddleware, listOrganizationsController);
organizationRoutes.get("/:organizationId/roles", authMiddleware, listRolesController);
organizationRoutes.post("/:organizationId/invitations", authMiddleware, createInvitationController);
organizationRoutes.get("/:organizationId/members", authMiddleware, listOrganizationMembersController);
organizationRoutes.patch(
  "/:organizationId/members/:membershipId",
  authMiddleware,
  changeMemberRoleController,
);
