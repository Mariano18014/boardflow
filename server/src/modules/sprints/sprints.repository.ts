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
