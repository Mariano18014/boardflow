import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { uploadSingleFile } from "../../middlewares/upload.middleware";
import { getMyProfileController, updateMyProfileController } from "./users.controller";
import { changeMyPasswordController } from "./password.controller";

export const usersRoutes = Router();

usersRoutes.get("/me", authMiddleware, getMyProfileController);
usersRoutes.patch("/me", authMiddleware, uploadSingleFile("avatar"), updateMyProfileController);
usersRoutes.patch("/me/password", authMiddleware, changeMyPasswordController);
