import type { NextFunction, Request, Response } from "express";
import {
  assignTaskToSprintSchema,
  type AssignTaskToSprintBody,
  type BacklogTaskItem,
} from "@shared/schemas/task.schema";
import { ValidationError } from "../../lib/errors";
import { assignTaskToSprint, getSprintTasks } from "./sprint-planning.service";

export async function getSprintTasksController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const sprintId = parseSprintIdParam(req.params.sprintId);
    const tasks = await getSprintTasks({ organizationId, projectId, sprintId }, req.userId!);
    res.status(200).json({ tasks: tasks.map(formatTaskForResponse) });
  } catch (error) {
    next(error);
  }
}

export async function assignTaskToSprintController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const taskId = parseTaskIdParam(req.params.taskId);
    const body = parseAssignTaskToSprintRequestBody(req.body);
    const task = await assignTaskToSprint(
      { organizationId, projectId, taskId, sprintId: body.sprintId },
      req.userId!,
    );
    res.status(200).json({ task: formatTaskForResponse(task) });
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

function parseTaskIdParam(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ taskId: ["taskId inválido."] });
  }
  return value;
}

function parseAssignTaskToSprintRequestBody(body: unknown): AssignTaskToSprintBody {
  const result = assignTaskToSprintSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function formatTaskForResponse(task: BacklogTaskItem) {
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
