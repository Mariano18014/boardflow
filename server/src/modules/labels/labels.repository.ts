import { prisma } from "../../db/client";

type CreateLabelData = {
  projectId: string;
  name: string;
  color: string;
};

export async function createLabel(data: CreateLabelData) {
  return prisma.label.create({ data });
}

export async function findLabelsByProjectId(projectId: string) {
  return prisma.label.findMany({
    where: { projectId },
    orderBy: { name: "asc" },
  });
}

export async function findLabelByProjectIdAndName(projectId: string, name: string) {
  return prisma.label.findFirst({
    where: { projectId, name: { equals: name, mode: "insensitive" } },
  });
}
