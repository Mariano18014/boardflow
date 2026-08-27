import type { NextFunction, Request, Response } from "express";
import {
  listBacklogQuerySchema,
  type BacklogTaskItem,
  type ListBacklogQuery,
} from "@shared/schemas/task.schema";
import { ValidationError } from "../../lib/errors";
import { getProjectBacklog } from "./backlog.service";

export async function getBacklogController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const query = parseListBacklogQuery(req.query);
    const tasks = await getProjectBacklog(
      {
        organizationId,
        projectId,
        pagination: { limit: query.limit, offset: query.offset },
      },
      req.userId!,
    );
    res.status(200).json({
      tasks: tasks.map(formatBacklogTaskForResponse),
      pagination: { limit: query.limit, offset: query.offset },
    });
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

function parseListBacklogQuery(query: unknown): ListBacklogQuery {
  const result = listBacklogQuerySchema.safeParse(query);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function formatBacklogTaskForResponse(task: BacklogTaskItem) {
  return {
    id: task.id,
    title: task.title,
    priority: task.priority,
    estimatedPoints: task.estimatedPoints,
    position: task.position,
    createdAt: task.createdAt,
    assignees: task.assignees,
  };
}
