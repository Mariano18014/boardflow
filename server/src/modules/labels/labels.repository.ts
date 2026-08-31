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

// Used by the tasks/labels submodule (HU-37) to verify that every labelId in
// a task's replacement set actually belongs to the task's project, the same
// way findActiveMembershipsByUserIds is used to verify assignees (HU-31).
export async function findLabelsByIdsAndProjectId(labelIds: string[], projectId: string) {
  return prisma.label.findMany({
    where: { id: { in: labelIds }, projectId },
  });
}
