import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildTaskApiError } from "./task-api-error";
import type { BacklogTask } from "./list-backlog.api";

export async function assignTaskToSprint(
  organizationId: string,
  projectId: string,
  taskId: string,
  sprintId: string | null,
): Promise<BacklogTask> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/tasks/${taskId}/sprint-assignment`,
    {
      method: "PATCH",
      headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ sprintId }),
    },
  );

  if (!response.ok) {
    throw await buildTaskApiError(response, "No se pudo mover la tarea.");
  }

  const body = await response.json();
  return body.task;
}
