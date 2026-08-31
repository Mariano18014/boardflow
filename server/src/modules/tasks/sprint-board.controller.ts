import type { NextFunction, Request, Response } from "express";
import type { Task } from "@prisma/client";
import { moveTaskToColumnSchema, type MoveTaskToColumnBody } from "@shared/schemas/task.schema";
import { ValidationError } from "../../lib/errors";
import { getSprintBoard } from "./sprint-board.service";
import { moveTaskToColumn } from "./move-task-column.service";

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

export async function moveTaskToColumnController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const taskId = parseTaskIdParam(req.params.taskId);
    const body = parseMoveTaskToColumnRequestBody(req.body);
    const task = await moveTaskToColumn(
      { organizationId, projectId, taskId, columnId: body.columnId, position: body.position },
      req.userId!,
    );
    res.status(200).json({ task: formatMovedTaskForResponse(task) });
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

function parseMoveTaskToColumnRequestBody(body: unknown): MoveTaskToColumnBody {
  const result = moveTaskToColumnSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function formatMovedTaskForResponse(task: Task) {
  return {
    id: task.id,
    boardId: task.boardId,
    columnId: task.columnId,
    position: task.position,
  };
}
