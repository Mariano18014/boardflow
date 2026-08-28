import type { NextFunction, Request, Response } from "express";
import {
  replaceTaskAssigneesSchema,
  type ReplaceTaskAssigneesBody,
} from "@shared/schemas/task-assignee.schema";
import { ValidationError } from "../../../lib/errors";
import { replaceTaskAssignees } from "./assignees.service";

export async function replaceTaskAssigneesController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const taskId = parseTaskIdParam(req.params.taskId);
    const body = parseReplaceTaskAssigneesRequestBody(req.body);
    const assignees = await replaceTaskAssignees(
      { organizationId, projectId, taskId, userIds: body.userIds },
      req.userId!,
    );
    res.status(200).json({ assignees });
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

function parseReplaceTaskAssigneesRequestBody(body: unknown): ReplaceTaskAssigneesBody {
  const result = replaceTaskAssigneesSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}
