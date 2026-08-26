import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { organizationRoutes } from "./organization.routes";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes);

// A medida que se implementen los demas modulos (projects, boards, ...)
// cada uno monta su propio router aqui, ej:
// router.use("/projects", projectRoutes);
