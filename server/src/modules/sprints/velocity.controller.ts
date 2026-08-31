import type { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../lib/errors";
import { getProjectVelocity, type SprintVelocity } from "./velocity.service";

export async function getProjectVelocityController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const velocity = await getProjectVelocity({ organizationId, projectId }, req.userId!);
    res.status(200).json({ velocity: velocity.map(formatSprintVelocityForResponse) });
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

function formatSprintVelocityForResponse(sprintVelocity: SprintVelocity) {
  return {
    sprintId: sprintVelocity.sprintId,
    name: sprintVelocity.name,
    startDate: sprintVelocity.startDate,
    endDate: sprintVelocity.endDate,
    completedPoints: sprintVelocity.completedPoints,
  };
}
