import type { NextFunction, Request, Response } from "express";
import type { Board } from "@prisma/client";
import {
  createBoardBodySchema,
  reorderBoardsSchema,
  type CreateBoardBody,
  type ReorderBoardsBody,
} from "@shared/schemas/board.schema";
import { ValidationError } from "../../lib/errors";
import { createBoard, getBoardsForProject, reorderBoards } from "./boards.service";

export async function createBoardController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const body = parseCreateBoardRequestBody(req.body);
    const board = await createBoard({ ...body, organizationId, projectId }, req.userId!);
    res.status(201).json({ board: formatBoardForResponse(board) });
  } catch (error) {
    next(error);
  }
}

export async function listBoardsController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const boards = await getBoardsForProject({ organizationId, projectId }, req.userId!);
    res.status(200).json({ boards: boards.map(formatBoardForResponse) });
  } catch (error) {
    next(error);
  }
}

export async function reorderBoardsController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const body = parseReorderBoardsRequestBody(req.body);
    const boards = await reorderBoards(
      { organizationId, projectId, boardIds: body.boardIds },
      req.userId!,
    );
    res.status(200).json({ boards: boards.map(formatBoardForResponse) });
  } catch (error) {
    next(error);
  }
}

function parseOrganizationIdParam(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ organizationId: ["organizationId inválido."] });
  }
  return value;
}

function parseProjectIdParam(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ projectId: ["projectId inválido."] });
  }
  return value;
}

function parseCreateBoardRequestBody(body: unknown): CreateBoardBody {
  const result = createBoardBodySchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function parseReorderBoardsRequestBody(body: unknown): ReorderBoardsBody {
  const result = reorderBoardsSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function formatBoardForResponse(board: Board) {
  return {
    id: board.id,
    projectId: board.projectId,
    name: board.name,
    position: board.position,
    isArchived: board.isArchived,
    createdAt: board.createdAt,
  };
}
