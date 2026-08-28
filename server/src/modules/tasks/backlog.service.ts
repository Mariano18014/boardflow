import type { Task } from "@prisma/client";
import type { BacklogTaskItem, CreateBacklogTaskInput } from "@shared/schemas/task.schema";
import { ConflictError, ValidationError } from "../../lib/errors";
import { checkProjectIsNotArchived, findProjectById } from "../../services/project.service";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import { calculateNextPosition } from "../../lib/next-position.util";
import {
  createTask as saveTaskRecord,
  findActiveBacklogTasksByProjectId,
  findMaxBacklogPositionByProjectId,
  findTasksWithoutSprint as findBacklogTasksInDatabase,
  updateTaskPositions,
} from "./tasks.repository";

type Pagination = {
  limit: number;
  offset: number;
};

export type GetBacklogInput = {
  organizationId: string;
  projectId: string;
  pagination: Pagination;
};

export async function getProjectBacklog(
  input: GetBacklogInput,
  requesterId: string,
): Promise<BacklogTaskItem[]> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "tasks:view");
  const project = await findProjectById(input.projectId, input.organizationId);
  const backlogTasks = await findTasksWithoutSprint(project.id, input.pagination);
  return backlogTasks;
}

export async function createBacklogTask(
  input: CreateBacklogTaskInput,
  requesterId: string,
): Promise<BacklogTaskItem> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "tasks:create");
  const project = await findProjectById(input.projectId, input.organizationId);
  await checkProjectIsNotArchived(project);
  const nextPosition = await calculateNextBacklogPosition(input.projectId);
  const task = await saveTaskInDatabase(input, nextPosition, requesterId);
  return mapTaskToBacklogItem(task);
}

async function calculateNextBacklogPosition(projectId: string): Promise<number> {
  return calculateNextPosition(() => findMaxBacklogPositionByProjectId(projectId));
}

async function saveTaskInDatabase(
  input: CreateBacklogTaskInput,
  position: number,
  creatorId: string,
): Promise<Task> {
  return saveTaskRecord({
    projectId: input.projectId,
    title: input.title,
    description: input.description,
    priority: input.priority,
    estimatedPoints: input.estimatedPoints,
    position,
    createdBy: creatorId,
  });
}

async function findTasksWithoutSprint(
  projectId: string,
  pagination: Pagination,
): Promise<BacklogTaskItem[]> {
  const tasks = await findBacklogTasksInDatabase(projectId, pagination);
  return tasks.map(mapTaskToBacklogItem);
}

function mapTaskToBacklogItem(task: Task): BacklogTaskItem {
  return {
    id: task.id,
    title: task.title,
    priority: task.priority,
    estimatedPoints: task.estimatedPoints,
    position: task.position,
    createdAt: task.createdAt,
    assignees: [],
  };
}

export type ReorderBacklogInput = {
  organizationId: string;
  projectId: string;
  taskIds: string[];
};

export async function reorderBacklogTasks(
  input: ReorderBacklogInput,
  requesterId: string,
): Promise<BacklogTaskItem[]> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "tasks:edit");
  await findProjectById(input.projectId, input.organizationId);
  const backlogTasks = await findActiveBacklogTasks(input.projectId);
  checkAllTaskIdsBelongToBacklog(input.taskIds, backlogTasks);
  checkTaskIdsCountMatchesBacklogTasks(input.taskIds, backlogTasks);
  const reorderedTasks = await updateTaskPositionsInTransaction(input.taskIds);
  return reorderedTasks.map(mapTaskToBacklogItem);
}

async function findActiveBacklogTasks(projectId: string): Promise<Task[]> {
  return findActiveBacklogTasksByProjectId(projectId);
}

function checkAllTaskIdsBelongToBacklog(taskIds: string[], backlogTasks: Task[]) {
  const backlogTaskIds = new Set(backlogTasks.map((task) => task.id));
  const unknownTaskIds = taskIds.filter((taskId) => !backlogTaskIds.has(taskId));
  if (unknownTaskIds.length > 0) {
    throw new ValidationError({
      taskIds: [
        `Las siguientes tareas no pertenecen al backlog de este proyecto: ${unknownTaskIds.join(", ")}`,
      ],
    });
  }
}

function checkTaskIdsCountMatchesBacklogTasks(taskIds: string[], backlogTasks: Task[]) {
  // Compares unique ids, not raw length, so a duplicated id in the payload
  // can't slip through by coincidentally matching the active backlog count.
  const uniqueTaskIdsCount = new Set(taskIds).size;
  if (uniqueTaskIdsCount !== backlogTasks.length) {
    throw new ConflictError(
      "El orden recibido no coincide con las tareas activas del backlog. Actualizá la página e intentá de nuevo.",
    );
  }
}

async function updateTaskPositionsInTransaction(taskIds: string[]): Promise<Task[]> {
  return updateTaskPositions(taskIds);
}
