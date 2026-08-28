import type { Prisma, Sprint, Task } from "@prisma/client";
import type { SprintStatus } from "@shared/types/enums";
import type { CreateSprintInput } from "@shared/schemas/sprint.schema";
import { ConflictError, NotFoundError, ValidationError } from "../../lib/errors";
import { checkProjectIsNotArchived, findProjectById } from "../../services/project.service";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import { runInTransaction } from "../../lib/reorder.util";
import { findActiveBoardsByProjectId } from "../boards/boards.repository";
import { findColumnByBoardIdAndName } from "../boards/columns/columns.repository";
import { calculateNextPositionInScope } from "../tasks/task-position.service";
import {
  findSprintTasksNotInColumn,
  updateTaskReturnedToBacklog,
} from "../tasks/tasks.repository";
import {
  createSprint as saveSprintRecord,
  findActiveSprintByProjectId,
  findSprintByIdAndProjectId,
  findSprintsByProjectId,
  updateSprintStatus as saveSprintStatus,
} from "./sprints.repository";

const DONE_COLUMN_NAME = "Done";

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

// Shared by every module that needs to confirm a sprint is currently the
// project's active one (the sprint board in HU-28, closing a sprint here in
// HU-32) so the check isn't duplicated.
export function checkSprintIsActive(sprint: Sprint) {
  if (sprint.status !== "ACTIVE") {
    throw new ConflictError(
      `Esta acción solo está disponible para el sprint activo del proyecto (estado actual: ${sprint.status}).`,
    );
  }
}

export type CloseSprintInput = {
  organizationId: string;
  projectId: string;
  sprintId: string;
};

export async function closeSprint(input: CloseSprintInput, requesterId: string): Promise<Sprint> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "sprints:edit");
  // findSprintById only confirms the sprint belongs to projectId — same
  // reasoning as sprint-board.service.ts / move-task-column.service.ts for
  // why this extra check is what actually prevents cross-organization access.
  await findProjectById(input.projectId, input.organizationId);
  const sprint = await findSprintById(input.sprintId, input.projectId);
  checkSprintIsActive(sprint);
  const doneColumn = await findDoneColumn(input.projectId);
  const unfinishedTasks = await findUnfinishedSprintTasks(sprint.id, doneColumn?.id ?? null);
  await returnTasksToBacklog(unfinishedTasks, input.projectId);
  const closedSprint = await updateSprintStatus(sprint, "COMPLETED");
  return closedSprint;
}

// Returns null (instead of throwing) when the project has no board yet, or
// the board has no "Done" column — this can happen if the sprint is closed
// without the board ever having been opened (HU-28 seeds the columns lazily).
// In that case every sprint task is treated as unfinished.
// Exported so velocity.service.ts (HU-33) can reuse the same lookup when
// calculating completed points per sprint.
export async function findDoneColumn(projectId: string) {
  const boards = await findActiveBoardsByProjectId(projectId);
  const board = boards[0];
  if (!board) {
    return null;
  }
  return findColumnByBoardIdAndName(board.id, DONE_COLUMN_NAME);
}

async function findUnfinishedSprintTasks(sprintId: string, doneColumnId: string | null): Promise<Task[]> {
  return findSprintTasksNotInColumn(sprintId, doneColumnId);
}

async function returnTasksToBacklog(tasks: Task[], projectId: string) {
  if (tasks.length === 0) {
    return;
  }
  // calculateNextPositionInScope is only called once, to find where the
  // backlog currently ends. Calling it again per task inside the transaction
  // below would read through a separate, non-transactional connection that
  // can't see the other tasks' uncommitted position updates yet, handing out
  // the same position to every task. Every task after the first just takes
  // the next integer instead.
  const startingPosition = await calculateNextPositionInScope(projectId, null);
  await runInTransaction(async (transaction) => {
    for (let index = 0; index < tasks.length; index++) {
      const position = calculateBacklogPositionForTask(startingPosition, index);
      await saveTaskReturnedToBacklog(transaction, tasks[index].id, position);
    }
  });
}

function calculateBacklogPositionForTask(startingPosition: number, index: number): number {
  return startingPosition + index;
}

async function saveTaskReturnedToBacklog(
  transaction: Prisma.TransactionClient,
  taskId: string,
  position: number,
) {
  await updateTaskReturnedToBacklog(transaction, taskId, position);
}
