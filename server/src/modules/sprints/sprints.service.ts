import type { Sprint } from "@prisma/client";
import type { SprintStatus } from "@shared/types/enums";
import type { CreateSprintInput } from "@shared/schemas/sprint.schema";
import { ValidationError } from "../../lib/errors";
import { checkProjectIsNotArchived, findProjectById } from "../../services/project.service";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import {
  createSprint as saveSprintRecord,
  findSprintsByProjectId,
} from "./sprints.repository";

export async function createSprint(input: CreateSprintInput, requesterId: string) {
  await checkRequesterHasPermission(input.organizationId, requesterId, "sprints:create");
  const project = await findProjectById(input.projectId, input.organizationId);
  await checkProjectIsNotArchived(project);
  checkSprintDateRangeIsValid(input.startDate, input.endDate);
  const sprint = await saveSprintInDatabase(input);
  return sprint;
}

function checkSprintDateRangeIsValid(startDate: Date, endDate: Date) {
  if (endDate <= startDate) {
    throw new ValidationError({
      endDate: ["La fecha de fin debe ser posterior a la fecha de inicio."],
    });
  }
}

async function saveSprintInDatabase(input: CreateSprintInput) {
  return saveSprintRecord({
    projectId: input.projectId,
    name: input.name,
    goal: input.goal,
    startDate: input.startDate,
    endDate: input.endDate,
  });
}

export type GetSprintsInput = {
  organizationId: string;
  projectId: string;
  status?: SprintStatus;
};

export async function getSprintsByProject(
  input: GetSprintsInput,
  requesterId: string,
): Promise<Sprint[]> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "sprints:view");
  await findProjectById(input.projectId, input.organizationId);
  return findSprintsForProject(input.projectId, input.status);
}

async function findSprintsForProject(projectId: string, status?: SprintStatus): Promise<Sprint[]> {
  return findSprintsByProjectId(projectId, status);
}
