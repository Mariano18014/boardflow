import type { Task } from "@prisma/client";
import { NotFoundError } from "../../lib/errors";
import { findTaskByIdAndProjectId } from "./tasks.repository";

// Shared by every service in this module that needs to look up a single task
// scoped to its project (move-task-column, task-detail, ...) so the
// 404-if-missing check isn't duplicated.
export async function findTaskById(taskId: string, projectId: string): Promise<Task> {
  const task = await findTaskByIdAndProjectId(taskId, projectId);
  if (!task) {
    throw new NotFoundError("La tarea no existe en este proyecto.");
  }
  return task;
}
