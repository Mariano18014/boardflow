import { Router } from "express";
import {
  acceptInvitationController,
  getInvitationDetailsController,
} from "../controllers/invitation.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const invitationRoutes = Router();

invitationRoutes.get("/:token", getInvitationDetailsController);
invitationRoutes.post("/:token/accept", authMiddleware, acceptInvitationController);
