import type { NextFunction, Request, Response } from "express";
import type { Project } from "@prisma/client";
import { createProjectSchema, type CreateProjectInput } from "@shared/schemas/project.schema";
import { ValidationError } from "../lib/errors";
import { createProject, getProjectById, getProjectsForOrganization } from "../services/project.service";

export async function createProjectController(req: Request, res: Response, next: NextFunction) {
  try {
    const input = parseCreateProjectRequestBody(req.body);
    const project = await createProject(input, req.userId!);
    res.status(201).json({ project: formatProjectForResponse(project) });
  } catch (error) {
    next(error);
  }
}

export async function listProjectsController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdQueryParam(req.query.organizationId);
    const projects = await getProjectsForOrganization(organizationId, req.userId!);
    res.status(200).json({ projects: projects.map(formatProjectForResponse) });
  } catch (error) {
    next(error);
  }
}

export async function getProjectController(req: Request, res: Response, next: NextFunction) {
  try {
    const projectId = parseProjectIdParam(req.params.projectId);
    const project = await getProjectById(projectId, req.userId!);
    res.status(200).json({ project: formatProjectForResponse(project) });
  } catch (error) {
    next(error);
  }
}

function parseCreateProjectRequestBody(body: unknown): CreateProjectInput {
  const result = createProjectSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function parseOrganizationIdQueryParam(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ organizationId: ["organizationId es requerido."] });
  }
  return value;
}

function parseProjectIdParam(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ projectId: ["projectId inválido."] });
  }
  return value;
}

function formatProjectForResponse(project: Project) {
  return {
    id: project.id,
    name: project.name,
    key: project.key,
    organizationId: project.organizationId,
  };
}
