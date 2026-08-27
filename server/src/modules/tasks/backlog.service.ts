import type { Task } from "@prisma/client";
import type { BacklogTaskItem, CreateBacklogTaskInput } from "@shared/schemas/task.schema";
import { checkProjectIsNotArchived, findProjectById } from "../../services/project.service";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import { calculateNextPosition } from "../../lib/next-position.util";
import {
  createTask as saveTaskRecord,
  findMaxBacklogPositionByProjectId,
  findTasksWithoutSprint as findBacklogTasksInDatabase,
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
