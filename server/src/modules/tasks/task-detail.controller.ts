import type { NextFunction, Request, Response } from "express";
import {
  updateTaskDetailsBodySchema,
  type TaskDetail,
  type UpdateTaskDetailsBody,
} from "@shared/schemas/task.schema";
import { ValidationError } from "../../lib/errors";
import { getTaskDetail, updateTaskDetails } from "./task-detail.service";

export async function getTaskDetailController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const taskId = parseTaskIdParam(req.params.taskId);
    const task = await getTaskDetail({ organizationId, projectId, taskId }, req.userId!);
    res.status(200).json({ task: formatTaskDetailForResponse(task) });
  } catch (error) {
    next(error);
  }
}

export async function updateTaskDetailsController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const taskId = parseTaskIdParam(req.params.taskId);
    const body = parseUpdateTaskDetailsRequestBody(req.body);
    const task = await updateTaskDetails(
      { organizationId, projectId, taskId, changes: body },
      req.userId!,
    );
    res.status(200).json({ task: formatTaskDetailForResponse(task) });
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

function parseTaskIdParam(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ taskId: ["taskId inválido."] });
  }
  return value;
}

function parseUpdateTaskDetailsRequestBody(body: unknown): UpdateTaskDetailsBody {
  const result = updateTaskDetailsBodySchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function formatTaskDetailForResponse(task: TaskDetail) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    estimatedPoints: task.estimatedPoints,
    dueDate: task.dueDate,
    position: task.position,
    sprintId: task.sprintId,
    columnId: task.columnId,
    createdBy: task.createdBy,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    assignees: task.assignees,
    labels: task.labels,
  };
}
