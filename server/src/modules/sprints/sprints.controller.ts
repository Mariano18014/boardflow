import type { NextFunction, Request, Response } from "express";
import type { Sprint } from "@prisma/client";
import {
  createSprintBodySchema,
  listSprintsQuerySchema,
  type CreateSprintBody,
  type ListSprintsQuery,
} from "@shared/schemas/sprint.schema";
import { ValidationError } from "../../lib/errors";
import { createSprint, getSprintsByProject } from "./sprints.service";

export async function createSprintController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const body = parseCreateSprintRequestBody(req.body);
    const sprint = await createSprint({ ...body, organizationId, projectId }, req.userId!);
    res.status(201).json({ sprint: formatSprintForResponse(sprint) });
  } catch (error) {
    next(error);
  }
}

export async function listSprintsController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const query = parseListSprintsQuery(req.query);
    const sprints = await getSprintsByProject(
      { organizationId, projectId, status: query.status },
      req.userId!,
    );
    res.status(200).json({ sprints: sprints.map(formatSprintForResponse) });
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

function parseCreateSprintRequestBody(body: unknown): CreateSprintBody {
  const result = createSprintBodySchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function parseListSprintsQuery(query: unknown): ListSprintsQuery {
  const result = listSprintsQuerySchema.safeParse(query);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function formatSprintForResponse(sprint: Sprint) {
  return {
    id: sprint.id,
    projectId: sprint.projectId,
    name: sprint.name,
    goal: sprint.goal,
    startDate: sprint.startDate,
    endDate: sprint.endDate,
    status: sprint.status,
  };
}
