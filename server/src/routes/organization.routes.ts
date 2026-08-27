import { Router } from "express";
import {
  createOrganizationController,
  listOrganizationsController,
  updateOrganizationController,
} from "../controllers/organization.controller";
import { createInvitationController } from "../controllers/invitation.controller";
import {
  changeMemberRoleController,
  listOrganizationMembersController,
  removeMemberController,
} from "../controllers/membership.controller";
import { rolesRoutes } from "../modules/roles/roles.routes";
import { getMyPermissionsController } from "../modules/permissions/permissions.controller";
import {
  createProjectController,
  listOrganizationProjectsController,
} from "../controllers/project.controller";
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
organizationRoutes.use("/:organizationId/roles", rolesRoutes);
organizationRoutes.post("/:organizationId/invitations", authMiddleware, createInvitationController);
organizationRoutes.get("/:organizationId/members", authMiddleware, listOrganizationMembersController);
organizationRoutes.get(
  "/:organizationId/members/me/permissions",
  authMiddleware,
  getMyPermissionsController,
);
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
organizationRoutes.post("/:organizationId/projects", authMiddleware, createProjectController);
organizationRoutes.get(
  "/:organizationId/projects",
  authMiddleware,
  listOrganizationProjectsController,
);
