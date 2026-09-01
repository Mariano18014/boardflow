import type { Sprint, Task } from "@prisma/client";
import type { BacklogTaskItem } from "@shared/schemas/task.schema";
import { ConflictError, NotFoundError } from "../../lib/errors";
import { findProjectById } from "../../services/project.service";
import { findSprintById } from "../sprints/sprints.service";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import { notifyBacklogChanged, notifySprintBoardChanged } from "../realtime/notify.service";
import { calculateNextPositionInScope } from "./task-position.service";
import { mapTaskToBacklogItem } from "./task-item.mapper";
import {
  findTaskByIdAndProjectId,
  findTasksBySprintId,
  updateTaskSprintAssignment as saveTaskSprintAssignment,
} from "./tasks.repository";

export type GetSprintTasksInput = {
  organizationId: string;
  projectId: string;
  sprintId: string;
};

export async function getSprintTasks(
  input: GetSprintTasksInput,
  requesterId: string,
): Promise<BacklogTaskItem[]> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "tasks:view");
  await findProjectById(input.projectId, input.organizationId);
  await findSprintById(input.sprintId, input.projectId);
  const tasks = await findTasksInSprint(input.sprintId);
  return Promise.all(tasks.map(mapTaskToBacklogItem));
}

async function findTasksInSprint(sprintId: string): Promise<Task[]> {
  return findTasksBySprintId(sprintId);
}

export type AssignTaskToSprintInput = {
  organizationId: string;
  projectId: string;
  taskId: string;
  sprintId: string | null;
};

export async function assignTaskToSprint(
  input: AssignTaskToSprintInput,
  requesterId: string,
): Promise<BacklogTaskItem> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "tasks:edit");
  const task = await findTaskById(input.taskId, input.projectId);
  await checkTaskCurrentSprintIsPlanned(task, input.projectId);
  const targetSprint = input.sprintId !== null ? await findSprintById(input.sprintId, input.projectId) : null;
  if (targetSprint !== null) {
    checkSprintIsPlanned(targetSprint);
  }
  const nextPosition = await calculateNextPositionInScope(input.projectId, input.sprintId);
  const updatedTask = await updateTaskSprintAssignment(task, input.sprintId, nextPosition);
  notifyAssignmentChange(input.projectId, targetSprint);
  return await mapTaskToBacklogItem(updatedTask);
}

// The task always leaves or enters the backlog, so backlog:changed always
// fires; board:changed only fires on top of that if the target sprint (if
// any) also happens to be the project's active one.
function notifyAssignmentChange(projectId: string, targetSprint: Sprint | null) {
  notifyBacklogChanged(projectId);
  if (targetSprint !== null && targetSprint.status === "ACTIVE") {
    notifySprintBoardChanged(targetSprint.id);
  }
}

// A task can only move (to the backlog, or to another sprint) while its
// current sprint is still PLANNED — once that sprint starts or finishes, its
// scope is locked and Sprint Planning no longer applies to it.
async function checkTaskCurrentSprintIsPlanned(task: Task, projectId: string) {
  if (task.sprintId === null) {
    return;
  }
  const currentSprint = await findSprintById(task.sprintId, projectId);
  checkSprintIsPlanned(currentSprint);
}

async function findTaskById(taskId: string, projectId: string): Promise<Task> {
  const task = await findTaskByIdAndProjectId(taskId, projectId);
  if (!task) {
    throw new NotFoundError("La tarea no existe en este proyecto.");
  }
  return task;
}

function checkSprintIsPlanned(sprint: Sprint) {
  if (sprint.status !== "PLANNED") {
    throw new ConflictError("Solo se pueden mover tareas hacia o desde sprints en estado planificado.");
  }
}

async function updateTaskSprintAssignment(
  task: Task,
  sprintId: string | null,
  position: number,
): Promise<Task> {
  return saveTaskSprintAssignment(task.id, sprintId, position);
}
