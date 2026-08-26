import { Router } from "express";
import { authRoutes } from "./auth.routes";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);

// A medida que se implementen los demas modulos (organizations, projects, boards, ...)
// cada uno monta su propio router aqui, ej:
// router.use("/organizations", organizationRoutes);
