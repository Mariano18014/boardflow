import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildTaskApiError } from "./task-api-error";

export type MovedTask = {
  id: string;
  boardId: string | null;
  columnId: string | null;
  position: number;
};

export async function moveTaskToColumn(
  organizationId: string,
  projectId: string,
  taskId: string,
  columnId: string,
  position: number,
): Promise<MovedTask> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/tasks/${taskId}/column`,
    {
      method: "PATCH",
      headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ columnId, position }),
    },
  );

  if (!response.ok) {
    throw await buildTaskApiError(response, "No se pudo mover la tarea.");
  }

  const body = await response.json();
  return body.task;
}
