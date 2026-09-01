import type { Sprint } from "@prisma/client";
import { findProjectById } from "../../services/project.service";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import { sumEstimatedPointsForSprintAndColumn } from "../tasks/tasks.repository";
import { findDoneColumn } from "./sprints.service";
import { findSprintsByProjectId } from "./sprints.repository";

export type GetProjectVelocityInput = {
  organizationId: string;
  projectId: string;
};

export type SprintVelocity = {
  sprintId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  completedPoints: number;
};

export async function getProjectVelocity(
  input: GetProjectVelocityInput,
  requesterId: string,
): Promise<SprintVelocity[]> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "sprints:view");
  const project = await findProjectById(input.projectId, input.organizationId);
  const completedSprints = await findCompletedSprints(project.id);
  const velocityData = await calculateCompletedPointsPerSprint(completedSprints, project.id);
  return velocityData;
}

async function findCompletedSprints(projectId: string): Promise<Sprint[]> {
  return findSprintsByProjectId(projectId, "COMPLETED");
}

async function calculateCompletedPointsPerSprint(
  sprints: Sprint[],
  projectId: string,
): Promise<SprintVelocity[]> {

  const doneColumn = await findDoneColumn(projectId);
  const velocityData: SprintVelocity[] = [];
  for (const sprint of sprints) {
    const completedPoints = await sumCompletedPointsForSprint(sprint.id, doneColumn?.id ?? null);
    velocityData.push({
      sprintId: sprint.id,
      name: sprint.name,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      completedPoints,
    });
  }
  return velocityData;
}

async function sumCompletedPointsForSprint(sprintId: string, doneColumnId: string | null): Promise<number> {
  if (doneColumnId === null) {
    return 0;
  }
  return sumEstimatedPointsForSprintAndColumn(sprintId, doneColumnId);
}
