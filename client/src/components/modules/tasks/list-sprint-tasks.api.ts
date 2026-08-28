import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildTaskApiError } from "./task-api-error";
import type { BacklogTask } from "./list-backlog.api";

export async function listSprintTasks(
  organizationId: string,
  projectId: string,
  sprintId: string,
): Promise<BacklogTask[]> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/sprints/${sprintId}/tasks`,
    {
      credentials: "include",
      headers: buildAuthorizationHeaders(),
    },
  );

  if (!response.ok) {
    throw await buildTaskApiError(response, "No se pudieron cargar las tareas del sprint.");
  }

  const body = await response.json();
  return body.tasks;
}
