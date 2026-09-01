import type { Task } from "@prisma/client";
import type { TaskPriority } from "@shared/types/enums";
import type { TaskDetail } from "@shared/schemas/task.schema";
import { ValidationError } from "../../lib/errors";
import { findProjectById } from "../../services/project.service";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import { notifyTaskContextChanged } from "../realtime/notify.service";
import { findTaskById } from "./task.service";
import { findAssigneesByTaskId } from "./assignees/assignees.service";
import { findLabelsByTaskId } from "./labels/labels.service";
import { updateTaskDetails as saveTaskDetailChanges } from "./tasks.repository";

export type GetTaskDetailInput = {
  organizationId: string;
  projectId: string;
  taskId: string;
};

export async function getTaskDetail(input: GetTaskDetailInput, requesterId: string): Promise<TaskDetail> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "tasks:view");
  await findProjectById(input.projectId, input.organizationId);
  const task = await findTaskById(input.taskId, input.projectId);
  return await mapTaskToDetail(task);
}

export type TaskDetailChanges = {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  estimatedPoints?: number;
  dueDate?: string;
};

export type UpdateTaskDetailsInput = {
  organizationId: string;
  projectId: string;
  taskId: string;
  changes: TaskDetailChanges;
};

export async function updateTaskDetails(
  input: UpdateTaskDetailsInput,
  requesterId: string,
): Promise<TaskDetail> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "tasks:edit");
  await findProjectById(input.projectId, input.organizationId);
  const task = await findTaskById(input.taskId, input.projectId);
  const allowedChanges = filterEditableFields(input.changes);
  validateTaskDetailChanges(allowedChanges);
  const updatedTask = await saveTaskDetailChanges(task.id, allowedChanges);
  await notifyTaskContextChanged(task);
  return await mapTaskToDetail(updatedTask);
}

function filterEditableFields(changes: TaskDetailChanges): TaskDetailChanges {
  return {
    title: changes.title,
    description: changes.description,
    priority: changes.priority,
    estimatedPoints: changes.estimatedPoints,
    dueDate: changes.dueDate,
  };
}

function validateTaskDetailChanges(changes: TaskDetailChanges) {
  validateTitle(changes.title);
  validateEstimatedPoints(changes.estimatedPoints);
  validateDueDate(changes.dueDate);
}

function validateTitle(title: string | undefined) {
  if (title !== undefined && title.trim().length === 0) {
    throw new ValidationError({ title: ["El título no puede estar vacío."] });
  }
}

function validateEstimatedPoints(estimatedPoints: number | undefined) {
  if (estimatedPoints !== undefined && estimatedPoints <= 0) {
    throw new ValidationError({
      estimatedPoints: ["Los puntos estimados deben ser un número entero positivo."],
    });
  }
}

function validateDueDate(dueDate: string | undefined) {
  if (dueDate === undefined) {
    return;
  }
  if (Number.isNaN(new Date(dueDate).getTime())) {
    throw new ValidationError({ dueDate: ["La fecha límite no es válida."] });
  }
}

async function mapTaskToDetail(task: Task): Promise<TaskDetail> {
  const assignees = await findAssigneesByTaskId(task.id);
  const labels = await findLabelsByTaskId(task.id);
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    estimatedPoints: task.estimatedPoints,
    dueDate: task.dueDate,
    position: task.position,
    sprintId: task.sprintId,
    columnId: task.columnId,
    createdBy: task.createdBy,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    assignees,
    labels,
  };
}
