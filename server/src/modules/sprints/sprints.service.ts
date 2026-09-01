import type { Column, Prisma, Sprint, Task } from "@prisma/client";
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
  findSprintTasksWithColumn,
  sumEstimatedPointsForSprint,
  updateTaskReturnedToBacklog,
} from "../tasks/tasks.repository";
import { createActivityLog } from "../activity-log/activity-log.repository";
import { SPRINT_CLOSED_ACTION, SPRINT_ENTITY_TYPE } from "../activity-log/activity-log.constants";
import type { SprintClosureSnapshot, SprintSnapshotTask } from "./sprint-closure-snapshot.types";
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

async function updateSprintStatus(sprint: Sprint, newStatus: SprintStatus): Promise<Sprint> {
  return saveSprintStatus(sprint.id, newStatus);
}

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

  await findProjectById(input.projectId, input.organizationId);
  const sprint = await findSprintById(input.sprintId, input.projectId);
  checkSprintIsActive(sprint);
  const doneColumn = await findDoneColumn(input.projectId);
  const unfinishedTasks = await findUnfinishedSprintTasks(sprint.id, doneColumn?.id ?? null);

  await recordSprintClosureSnapshot(sprint, doneColumn, requesterId, input.organizationId);
  await returnTasksToBacklog(unfinishedTasks, input.projectId);
  const closedSprint = await updateSprintStatus(sprint, "COMPLETED");
  return closedSprint;
}

async function recordSprintClosureSnapshot(
  sprint: Sprint,
  doneColumn: Column | null,
  actorId: string,
  organizationId: string,
): Promise<void> {
  const tasks = await findSprintTasksWithColumn(sprint.id);
  const totalCommittedPoints = await calculateTotalCommittedPoints(sprint.id);
  const metadata = buildSprintSnapshotData(sprint, tasks, doneColumn?.id ?? null, totalCommittedPoints);
  await saveActivityLogEntry(sprint.id, actorId, organizationId, metadata);
}

export async function calculateTotalCommittedPoints(sprintId: string): Promise<number> {
  return sumEstimatedPointsForSprint(sprintId);
}

function buildSprintSnapshotData(
  sprint: Sprint,
  tasks: Array<Task & { column: Column | null }>,
  doneColumnId: string | null,
  totalCommittedPoints: number,
): SprintClosureSnapshot {
  return {
    sprintName: sprint.name,
    goal: sprint.goal,
    startDate: sprint.startDate.toISOString(),
    endDate: sprint.endDate.toISOString(),
    totalCommittedPoints,
    completedPoints: calculateCompletedPointsFromSnapshot(tasks, doneColumnId),
    tasks: tasks.map(mapTaskToSnapshotItem),
  };
}

function calculateCompletedPointsFromSnapshot(
  tasks: Array<Task & { column: Column | null }>,
  doneColumnId: string | null,
): number {
  if (doneColumnId === null) {
    return 0;
  }
  return tasks
    .filter((task) => task.columnId === doneColumnId)
    .reduce((sum, task) => sum + (task.estimatedPoints ?? 0), 0);
}

function mapTaskToSnapshotItem(task: Task & { column: Column | null }): SprintSnapshotTask {
  return {
    taskId: task.id,
    title: task.title,
    priority: task.priority,
    estimatedPoints: task.estimatedPoints,
    columnId: task.columnId,
    columnName: task.column?.name ?? null,
  };
}

async function saveActivityLogEntry(
  sprintId: string,
  actorId: string,
  organizationId: string,
  metadata: SprintClosureSnapshot,
): Promise<void> {
  await createActivityLog({
    organizationId,
    actorId,
    action: SPRINT_CLOSED_ACTION,
    entityType: SPRINT_ENTITY_TYPE,
    entityId: sprintId,
    metadata,
  });
}

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
