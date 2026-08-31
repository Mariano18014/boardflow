import type { NextFunction, Request, Response } from "express";
import type { Label } from "@prisma/client";
import {
  createLabelBodySchema,
  type CreateLabelBody,
} from "@shared/schemas/label.schema";
import { ValidationError } from "../../lib/errors";
import { createLabel, getProjectLabels } from "./labels.service";

export async function createLabelController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const body = parseCreateLabelRequestBody(req.body);
    const label = await createLabel({ ...body, organizationId, projectId }, req.userId!);
    res.status(201).json({ label: formatLabelForResponse(label) });
  } catch (error) {
    next(error);
  }
}

export async function listLabelsController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const labels = await getProjectLabels({ organizationId, projectId }, req.userId!);
    res.status(200).json({ labels: labels.map(formatLabelForResponse) });
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

function parseCreateLabelRequestBody(body: unknown): CreateLabelBody {
  const result = createLabelBodySchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function formatLabelForResponse(label: Label) {
  return {
    id: label.id,
    projectId: label.projectId,
    name: label.name,
    color: label.color,
  };
}
