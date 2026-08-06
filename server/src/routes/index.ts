import { Router } from "express";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// A medida que se implementen los modulos (auth, organizations, projects, boards, ...)
// cada uno monta su propio router aqui, ej:
// router.use("/auth", authRoutes);
// router.use("/organizations", organizationRoutes);
