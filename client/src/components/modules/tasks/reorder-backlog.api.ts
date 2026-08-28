import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildTaskApiError } from "./task-api-error";
import type { BacklogTask } from "./list-backlog.api";

export async function reorderBacklogTasks(
  organizationId: string,
  projectId: string,
  taskIds: string[],
): Promise<BacklogTask[]> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/backlog/reorder`,
    {
      method: "PATCH",
      headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ taskIds }),
    },
  );

  if (!response.ok) {
    throw await buildTaskApiError(response, "No se pudo reordenar el backlog.");
  }

  const body = await response.json();
  return body.tasks;
}
