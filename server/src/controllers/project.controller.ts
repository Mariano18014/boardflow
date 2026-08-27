import type { NextFunction, Request, Response } from "express";
import type { Project } from "@prisma/client";
import {
  createProjectBodySchema,
  listProjectsQuerySchema,
  type CreateProjectBody,
  type ListProjectsQuery,
  type ProjectListItem,
} from "@shared/schemas/project.schema";
import { ValidationError } from "../lib/errors";
import {
  archiveProject,
  createProject,
  getOrganizationProjects,
  getProjectById,
  getProjectsForOrganization,
  restoreProject,
} from "../services/project.service";

export async function createProjectController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const body = parseCreateProjectRequestBody(req.body);
    const project = await createProject({ ...body, organizationId }, req.userId!);
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

export async function listOrganizationProjectsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const query = parseListProjectsQuery(req.query);
    const projects = await getOrganizationProjects(
      {
        organizationId,
        includeArchived: query.includeArchived,
        limit: query.limit,
        offset: query.offset,
      },
      req.userId!,
    );
    res.status(200).json({
      projects: projects.map(formatProjectListItemForResponse),
      pagination: { limit: query.limit, offset: query.offset },
    });
  } catch (error) {
    next(error);
  }
}

export async function archiveProjectController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const project = await archiveProject({ organizationId, projectId }, req.userId!);
    res.status(200).json({ project: formatProjectForResponse(project) });
  } catch (error) {
    next(error);
  }
}

export async function restoreProjectController(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationId = parseOrganizationIdParam(req.params.organizationId);
    const projectId = parseProjectIdParam(req.params.projectId);
    const project = await restoreProject({ organizationId, projectId }, req.userId!);
    res.status(200).json({ project: formatProjectForResponse(project) });
  } catch (error) {
    next(error);
  }
}

function parseCreateProjectRequestBody(body: unknown): CreateProjectBody {
  const result = createProjectBodySchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function parseOrganizationIdParam(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ValidationError({ organizationId: ["organizationId inválido."] });
  }
  return value;
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

function parseListProjectsQuery(query: unknown): ListProjectsQuery {
  const result = listProjectsQuerySchema.safeParse(query);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function formatProjectForResponse(project: Project) {
  return {
    id: project.id,
    name: project.name,
    key: project.key,
    description: project.description,
    isArchived: project.isArchived,
    organizationId: project.organizationId,
  };
}

function formatProjectListItemForResponse(project: ProjectListItem) {
  return {
    id: project.id,
    name: project.name,
    key: project.key,
    description: project.description,
    isArchived: project.isArchived,
    createdAt: project.createdAt,
    boardsCount: project.boardsCount,
  };
}
