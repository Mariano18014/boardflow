import { prisma } from "../client";

type CreateProjectData = {
  name: string;
  key: string;
  organizationId: string;
  createdBy: string;
};

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
