import type { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../lib/errors";
import { getSprintBoard } from "./sprint-board.service";

export async function getSprintBoardController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const sprintId = parseSprintIdParam(req.params.sprintId);
    const board = await getSprintBoard({ organizationId, projectId, sprintId }, req.userId!);
    res.status(200).json(board);
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

function parseSprintIdParam(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ sprintId: ["sprintId inválido."] });
  }
  return value;
}
