import type { NextFunction, Request, Response } from "express";
import type { Column } from "@prisma/client";
import {
  updateColumnWipLimitBodySchema,
  type UpdateColumnWipLimitBody,
} from "@shared/schemas/column.schema";
import { ValidationError } from "../../../lib/errors";
import { updateColumnWipLimit } from "./columns.service";

export async function updateColumnWipLimitController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const columnId = parseColumnIdParam(req.params.columnId);
    const body = parseUpdateWipLimitRequestBody(req.body);
    const column = await updateColumnWipLimit(
      { organizationId, projectId, columnId, wipLimit: body.wipLimit },
      req.userId!,
    );
    res.status(200).json({ column: formatColumnForResponse(column) });
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

function parseColumnIdParam(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ columnId: ["columnId inválido."] });
  }
  return value;
}

function parseUpdateWipLimitRequestBody(body: unknown): UpdateColumnWipLimitBody {
  const result = updateColumnWipLimitBodySchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function formatColumnForResponse(column: Column) {
  return {
    id: column.id,
    boardId: column.boardId,
    name: column.name,
    position: column.position,
    wipLimit: column.wipLimit,
  };
}
