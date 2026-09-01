import type { Task } from "@prisma/client";
import { NotFoundError } from "../../lib/errors";
import { findTaskByIdAndProjectId } from "./tasks.repository";

export async function findTaskById(taskId: string, projectId: string): Promise<Task> {
  const task = await findTaskByIdAndProjectId(taskId, projectId);
  if (!task) {
    throw new NotFoundError("La tarea no existe en este proyecto.");
  }
  return task;
}
