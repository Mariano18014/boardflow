import type { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../lib/errors";
import { getSprintHistory } from "./sprint-history.service";

const NO_HISTORY_MESSAGE = "No hay historial disponible para este sprint.";

export async function getSprintHistoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const sprintId = parseSprintIdParam(req.params.sprintId);
    const result = await getSprintHistory({ organizationId, projectId, sprintId }, req.userId!);
    if (!result.available) {
      res.status(200).json({ available: false, message: NO_HISTORY_MESSAGE });
      return;
    }
    res.status(200).json({ available: true, snapshot: result.snapshot });
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
