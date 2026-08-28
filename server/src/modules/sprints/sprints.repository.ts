import type { SprintStatus } from "@shared/types/enums";
import { prisma } from "../../db/client";

const INITIAL_SPRINT_STATUS: SprintStatus = "PLANNED";

type CreateSprintData = {
  projectId: string;
  name: string;
  goal?: string;
  startDate: Date;
  endDate: Date;
};

export async function createSprint(data: CreateSprintData) {
  return prisma.sprint.create({
    data: {
      projectId: data.projectId,
      name: data.name,
      goal: data.goal,
      startDate: data.startDate,
      endDate: data.endDate,
      status: INITIAL_SPRINT_STATUS,
    },
  });
}

export async function findSprintsByProjectId(projectId: string, status?: SprintStatus) {
  return prisma.sprint.findMany({
    where: { projectId, ...(status ? { status } : {}) },
    orderBy: { startDate: "asc" },
  });
}

export async function findSprintByIdAndProjectId(sprintId: string, projectId: string) {
  return prisma.sprint.findFirst({ where: { id: sprintId, projectId } });
}

export async function findActiveSprintByProjectId(projectId: string) {
  return prisma.sprint.findFirst({ where: { projectId, status: "ACTIVE" } });
}

export async function updateSprintStatus(sprintId: string, status: SprintStatus) {
  return prisma.sprint.update({
    where: { id: sprintId },
    data: { status },
  });
}
