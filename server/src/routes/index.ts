import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { organizationRoutes } from "./organization.routes";
import { projectRoutes } from "./project.routes";
import { invitationRoutes } from "./invitation.routes";
import { permissionsRoutes } from "../modules/permissions/permissions.routes";
import { usersRoutes } from "../modules/users/users.routes";
import { notificationsRoutes } from "../modules/notifications/notifications.routes";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes);
router.use("/projects", projectRoutes);
router.use("/invitations", invitationRoutes);
router.use("/permissions", permissionsRoutes);
router.use("/users", usersRoutes);
router.use("/notifications", notificationsRoutes);

// A medida que se implementen los demas modulos (boards, sprints, ...)
// cada uno monta su propio router aqui, ej:
// router.use("/boards", boardRoutes);
