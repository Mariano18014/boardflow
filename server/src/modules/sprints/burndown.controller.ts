import type { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../lib/errors";
import { getSprintBurndown, type SprintBurndown } from "./burndown.service";

export async function getSprintBurndownController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const sprintId = parseSprintIdParam(req.params.sprintId);
    const burndown = await getSprintBurndown({ organizationId, projectId, sprintId }, req.userId!);
    res.status(200).json(formatBurndownForResponse(burndown));
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

function formatBurndownForResponse(burndown: SprintBurndown) {
  return {
    sprint: {
      name: burndown.sprint.name,
      startDate: burndown.sprint.startDate,
      endDate: burndown.sprint.endDate,
    },
    totalCommittedPoints: burndown.totalCommittedPoints,
    idealLine: burndown.idealLine,
    actualLine: burndown.actualLine,
  };
}
