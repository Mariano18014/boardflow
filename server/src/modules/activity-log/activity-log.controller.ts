import type { NextFunction, Request, Response } from "express";
import { listActivityLogQuerySchema, type ListActivityLogQuery } from "@shared/schemas/activity-log.schema";
import { ValidationError } from "../../lib/errors";
import { getOrganizationActivityLog } from "./activity-log.service";

export async function getActivityLogController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const query = parseListActivityLogQuery(req.query);
    const entries = await getOrganizationActivityLog(
      { organizationId, pagination: { limit: query.limit, offset: query.offset } },
      req.userId!,
    );
    res.status(200).json({ entries, pagination: { limit: query.limit, offset: query.offset } });
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

function parseListActivityLogQuery(query: unknown): ListActivityLogQuery {
  const result = listActivityLogQuerySchema.safeParse(query);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}
