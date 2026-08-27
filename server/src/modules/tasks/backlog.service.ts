import type { Task } from "@prisma/client";
import type { BacklogTaskItem } from "@shared/schemas/task.schema";
import { NotFoundError } from "../../lib/errors";
import { findProjectByIdAndOrganizationId } from "../../db/repositories/project.repository";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import { findTasksWithoutSprint as findBacklogTasksInDatabase } from "./tasks.repository";

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

async function findProjectById(projectId: string, organizationId: string) {
  const project = await findProjectByIdAndOrganizationId(projectId, organizationId);
  if (!project) {
    throw new NotFoundError("El proyecto no existe en esta organización.");
  }
  return project;
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
