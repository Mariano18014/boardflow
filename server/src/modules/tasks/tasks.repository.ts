import type { TaskPriority } from "@shared/types/enums";
import { prisma } from "../../db/client";
import { runInTransaction } from "../../lib/reorder.util";

type Pagination = {
  limit: number;
  offset: number;
};

export async function findTasksWithoutSprint(projectId: string, pagination: Pagination) {
  return prisma.task.findMany({
    where: { projectId, sprintId: null, isArchived: false, deletedAt: null },
    orderBy: { position: "asc" },
    take: pagination.limit,
    skip: pagination.offset,
  });
}

export async function findMaxBacklogPositionByProjectId(projectId: string): Promise<number | null> {
  const result = await prisma.task.aggregate({
    where: { projectId, sprintId: null },
    _max: { position: true },
  });
  return result._max.position;
}

type CreateTaskData = {
  projectId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  estimatedPoints: number;
  position: number;
  createdBy: string;
};

export async function createTask(data: CreateTaskData) {
  return prisma.task.create({
    data: {
      projectId: data.projectId,
      title: data.title,
      description: data.description,
      priority: data.priority,
      estimatedPoints: data.estimatedPoints,
      position: data.position,
      createdBy: data.createdBy,
      sprintId: null,
      boardId: null,
      columnId: null,
    },
  });
}

export async function findActiveBacklogTasksByProjectId(projectId: string) {
  return prisma.task.findMany({
    where: { projectId, sprintId: null, isArchived: false, deletedAt: null },
    orderBy: { position: "asc" },
  });
}

export async function updateTaskPositions(taskIds: string[]) {
  return runInTransaction((transaction) =>
    Promise.all(
      taskIds.map((taskId, index) =>
        transaction.task.update({ where: { id: taskId }, data: { position: index } }),
      ),
    ),
  );
}
