import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildTaskApiError } from "./task-api-error";
import type { AssigneeSummary } from "./assignee-summary";

export type TaskDetail = {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  estimatedPoints: number | null;
  dueDate: string | null;
  position: number;
  sprintId: string | null;
  columnId: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  assignees: AssigneeSummary[];
  labels: unknown[];
};

export async function getTaskDetail(
  organizationId: string,
  projectId: string,
  taskId: string,
): Promise<TaskDetail> {
  const response = await fetch(`/api/organizations/${organizationId}/projects/${projectId}/tasks/${taskId}`, {
    credentials: "include",
    headers: buildAuthorizationHeaders(),
  });

  if (!response.ok) {
    throw await buildTaskApiError(response, "No se pudo cargar el detalle de la tarea.");
  }

  const body = await response.json();
  return body.task;
}
