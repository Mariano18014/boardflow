import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { organizationRoutes } from "./organization.routes";
import { projectRoutes } from "./project.routes";
import { invitationRoutes } from "./invitation.routes";
import { permissionsRoutes } from "../modules/permissions/permissions.routes";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes);
router.use("/projects", projectRoutes);
router.use("/invitations", invitationRoutes);
router.use("/permissions", permissionsRoutes);

// A medida que se implementen los demas modulos (boards, sprints, ...)
// cada uno monta su propio router aqui, ej:
// router.use("/boards", boardRoutes);
