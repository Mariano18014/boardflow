import type { Prisma } from "@prisma/client";
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

export async function findTaskByIdAndProjectId(taskId: string, projectId: string) {
  return prisma.task.findFirst({
    where: { id: taskId, projectId, deletedAt: null },
  });
}

export async function findTasksBySprintId(sprintId: string) {
  return prisma.task.findMany({
    where: { sprintId, isArchived: false, deletedAt: null },
    orderBy: { position: "asc" },
  });
}

export async function findMaxPositionInSprint(sprintId: string): Promise<number | null> {
  const result = await prisma.task.aggregate({
    where: { sprintId },
    _max: { position: true },
  });
  return result._max.position;
}

export async function updateTaskSprintAssignment(taskId: string, sprintId: string | null, position: number) {
  return prisma.task.update({
    where: { id: taskId },
    // boardId and columnId are intentionally left untouched here — they only
    // get assigned once the sprint starts (HU-27) and the task shows up on the
    // sprint board (HU-28), not during Sprint Planning.
    data: { sprintId, position },
  });
}

export async function findSprintTasksWithoutColumn(sprintId: string) {
  return prisma.task.findMany({
    where: { sprintId, columnId: null, isArchived: false, deletedAt: null },
    orderBy: { position: "asc" },
  });
}

export async function findColumnTasksForSprint(columnId: string, sprintId: string) {
  return prisma.task.findMany({
    where: { columnId, sprintId, isArchived: false, deletedAt: null },
    orderBy: { position: "asc" },
  });
}

export async function findMaxPositionInColumn(columnId: string): Promise<number | null> {
  const result = await prisma.task.aggregate({
    where: { columnId },
    _max: { position: true },
  });
  return result._max.position;
}

export async function updateTaskColumnAssignment(
  taskId: string,
  boardId: string,
  columnId: string,
  position: number,
) {
  return prisma.task.update({
    where: { id: taskId },
    data: { boardId, columnId, position },
  });
}

export async function countTasksInColumn(columnId: string): Promise<number> {
  return prisma.task.count({
    where: { columnId, isArchived: false, deletedAt: null },
  });
}

type UpdateTaskDetailsData = {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  estimatedPoints?: number;
  dueDate?: string;
};

export async function findSprintTasksNotInColumn(sprintId: string, excludedColumnId: string | null) {
  return prisma.task.findMany({
    where: {
      sprintId,
      isArchived: false,
      deletedAt: null,
      // No excluded column (the board was never opened) means nothing is
      // filtered out — every sprint task counts as unfinished.
      columnId: excludedColumnId === null ? undefined : { not: excludedColumnId },
    },
  });
}

export async function updateTaskReturnedToBacklog(
  transaction: Prisma.TransactionClient,
  taskId: string,
  position: number,
) {
  return transaction.task.update({
    where: { id: taskId },
    data: { sprintId: null, boardId: null, columnId: null, position },
  });
}

export async function updateTaskDetails(taskId: string, changes: UpdateTaskDetailsData) {
  return prisma.task.update({
    where: { id: taskId },
    data: {
      title: changes.title,
      description: changes.description,
      priority: changes.priority,
      estimatedPoints: changes.estimatedPoints,
      // undefined here means "field not sent, don't touch it" (Prisma skips
      // undefined keys); only convert to a real Date when a value was sent.
      dueDate: changes.dueDate === undefined ? undefined : new Date(changes.dueDate),
    },
  });
}
