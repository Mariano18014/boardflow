import type { CreateSprintInput } from "@shared/schemas/sprint.schema";
import { ValidationError } from "../../lib/errors";
import { checkProjectIsNotArchived, findProjectById } from "../../services/project.service";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import { createSprint as saveSprintRecord } from "./sprints.repository";

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
