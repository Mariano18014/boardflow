import type { Project } from "@prisma/client";
import { prisma } from "../client";

type CreateProjectData = {
  name: string;
  key: string;
  organizationId: string;
  createdBy: string;
  description?: string;
};

type ProjectListFilters = {
  includeArchived: boolean;
  limit: number;
  offset: number;
};

export type ProjectWithBoardsCount = Project & { _count: { boards: number } };

export async function createProject(data: CreateProjectData) {
  return prisma.project.create({ data });
}

export async function findProjectByKey(organizationId: string, key: string) {
  return prisma.project.findUnique({
    where: { organizationId_key: { organizationId, key } },
  });
}

export async function findProjectsByOrganizationId(organizationId: string) {
  return prisma.project.findMany({
    where: { organizationId, isArchived: false, deletedAt: null },
    orderBy: { createdAt: "asc" },
  });
}

export async function findProjectById(id: string) {
  return prisma.project.findUnique({ where: { id } });
}

export async function findProjectByIdAndOrganizationId(projectId: string, organizationId: string) {
  return prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null },
  });
}

export async function findProjectsForOrganization(
  organizationId: string,
  filters: ProjectListFilters,
): Promise<ProjectWithBoardsCount[]> {
  return prisma.project.findMany({
    where: buildProjectWhereClause(organizationId, filters.includeArchived),
    include: { _count: { select: { boards: true } } },
    orderBy: { createdAt: "desc" },
    take: filters.limit,
    skip: filters.offset,
  });
}

function buildProjectWhereClause(organizationId: string, includeArchived: boolean) {
  if (includeArchived) {
    return { organizationId, deletedAt: null };
  }
  return { organizationId, deletedAt: null, isArchived: false };
}
