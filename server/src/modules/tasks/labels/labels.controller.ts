import type { NextFunction, Request, Response } from "express";
import {
  replaceTaskLabelsSchema,
  type ReplaceTaskLabelsBody,
} from "@shared/schemas/task-label.schema";
import { ValidationError } from "../../../lib/errors";
import { replaceTaskLabels } from "./labels.service";

export async function replaceTaskLabelsController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const taskId = parseTaskIdParam(req.params.taskId);
    const body = parseReplaceTaskLabelsRequestBody(req.body);
    const labels = await replaceTaskLabels(
      { organizationId, projectId, taskId, labelIds: body.labelIds },
      req.userId!,
    );
    res.status(200).json({ labels });
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

function parseReplaceTaskLabelsRequestBody(body: unknown): ReplaceTaskLabelsBody {
  const result = replaceTaskLabelsSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}
