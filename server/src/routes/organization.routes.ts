import { Router } from "express";
import {
  createOrganizationController,
  listOrganizationsController,
  listRolesController,
  updateOrganizationController,
} from "../controllers/organization.controller";
import { createInvitationController } from "../controllers/invitation.controller";
import {
  changeMemberRoleController,
  listOrganizationMembersController,
  removeMemberController,
} from "../controllers/membership.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadSingleFile } from "../middlewares/upload.middleware";

export const organizationRoutes = Router();

organizationRoutes.post("/", authMiddleware, createOrganizationController);
organizationRoutes.get("/", authMiddleware, listOrganizationsController);
organizationRoutes.patch(
  "/:organizationId",
  authMiddleware,
  uploadSingleFile("logo"),
  updateOrganizationController,
);
organizationRoutes.get("/:organizationId/roles", authMiddleware, listRolesController);
organizationRoutes.post("/:organizationId/invitations", authMiddleware, createInvitationController);
organizationRoutes.get("/:organizationId/members", authMiddleware, listOrganizationMembersController);
organizationRoutes.patch(
  "/:organizationId/members/:membershipId",
  authMiddleware,
  changeMemberRoleController,
);
organizationRoutes.delete(
  "/:organizationId/members/:membershipId",
  authMiddleware,
  removeMemberController,
);
