import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  createBoardController,
  listBoardsController,
  reorderBoardsController,
} from "./boards.controller";
import { columnsRoutes } from "./columns/columns.routes";

export const boardsRoutes = Router({ mergeParams: true });

boardsRoutes.post("/", authMiddleware, createBoardController);
boardsRoutes.get("/", authMiddleware, listBoardsController);
boardsRoutes.patch("/reorder", authMiddleware, reorderBoardsController);
boardsRoutes.use("/columns", columnsRoutes);
