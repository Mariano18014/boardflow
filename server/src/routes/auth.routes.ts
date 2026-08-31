import { Router } from "express";
import {
  forgotPasswordController,
  loginController,
  meController,
  refreshTokenController,
  registerController,
  resetPasswordController,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.post("/refresh", refreshTokenController);
authRoutes.get("/me", authMiddleware, meController);
authRoutes.post("/forgot-password", forgotPasswordController);
authRoutes.post("/reset-password", resetPasswordController);
