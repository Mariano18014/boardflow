import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildTaskApiError } from "./task-api-error";
import type { TaskDetail } from "./get-task-detail.api";

export type UpdateTaskDetailsBody = {
  title?: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  estimatedPoints?: number;
  dueDate?: string;
};

export async function updateTaskDetails(
  organizationId: string,
  projectId: string,
  taskId: string,
  changes: UpdateTaskDetailsBody,
): Promise<TaskDetail> {
  const response = await fetch(`/api/organizations/${organizationId}/projects/${projectId}/tasks/${taskId}`, {
    method: "PATCH",
    headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(changes),
  });

  if (!response.ok) {
    throw await buildTaskApiError(response, "No se pudo guardar la tarea.");
  }

  const body = await response.json();
  return body.task;
}
