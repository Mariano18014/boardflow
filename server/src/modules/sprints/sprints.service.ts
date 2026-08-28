import type { Sprint } from "@prisma/client";
import type { SprintStatus } from "@shared/types/enums";
import type { CreateSprintInput } from "@shared/schemas/sprint.schema";
import { ConflictError, NotFoundError, ValidationError } from "../../lib/errors";
import { checkProjectIsNotArchived, findProjectById } from "../../services/project.service";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import {
  createSprint as saveSprintRecord,
  findActiveSprintByProjectId,
  findSprintByIdAndProjectId,
  findSprintsByProjectId,
  updateSprintStatus as saveSprintStatus,
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

// Shared by every module that needs to look up a single sprint scoped to its
// project (sprints itself, sprint planning in the tasks module, ...) so the
// 404-if-missing check isn't duplicated.
export async function findSprintById(sprintId: string, projectId: string): Promise<Sprint> {
  const sprint = await findSprintByIdAndProjectId(sprintId, projectId);
  if (!sprint) {
    throw new NotFoundError("El sprint no existe en este proyecto.");
  }
  return sprint;
}

export type StartSprintInput = {
  organizationId: string;
  projectId: string;
  sprintId: string;
};

export async function startSprint(input: StartSprintInput, requesterId: string): Promise<Sprint> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "sprints:edit");
  const project = await findProjectById(input.projectId, input.organizationId);
  await checkProjectIsNotArchived(project);
  const sprint = await findSprintById(input.sprintId, input.projectId);
  checkSprintIsPlanned(sprint);
  await checkNoOtherActiveSprintExists(input.projectId);
  // Starting a sprint only flips its status. Moving its tasks onto the board
  // (assigning boardId/columnId, creating the To Do/In Progress/Review/Done
  // columns) is intentionally NOT done here — that's HU-28's responsibility.
  const activatedSprint = await updateSprintStatus(sprint, "ACTIVE");
  return activatedSprint;
}

function checkSprintIsPlanned(sprint: Sprint) {
  if (sprint.status !== "PLANNED") {
    throw new ConflictError(
      `Solo se puede iniciar un sprint en estado planificado (estado actual: ${sprint.status}).`,
    );
  }
}

async function checkNoOtherActiveSprintExists(projectId: string) {
  const activeSprint = await findActiveSprintByProjectId(projectId);
  if (activeSprint) {
    throw new ConflictError(
      `Ya hay un sprint activo en este proyecto: "${activeSprint.name}". Cerralo antes de iniciar uno nuevo.`,
    );
  }
}

// newStatus is a parameter (not hardcoded to "ACTIVE") so this same transition
// helper can be reused by HU-32 (closing a sprint: ACTIVE -> COMPLETED).
async function updateSprintStatus(sprint: Sprint, newStatus: SprintStatus): Promise<Sprint> {
  return saveSprintStatus(sprint.id, newStatus);
}
