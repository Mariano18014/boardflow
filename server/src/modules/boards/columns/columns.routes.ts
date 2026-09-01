import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { updateColumnWipLimitController } from "./columns.controller";

export const columnsRoutes = Router({ mergeParams: true });

columnsRoutes.patch("/:columnId/wip-limit", authMiddleware, updateColumnWipLimitController);
