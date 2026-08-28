import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildTaskApiError } from "./task-api-error";
import type { AssigneeSummary } from "./assignee-summary";

export async function replaceTaskAssignees(
  organizationId: string,
  projectId: string,
  taskId: string,
  userIds: string[],
): Promise<AssigneeSummary[]> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/tasks/${taskId}/assignees`,
    {
      method: "PUT",
      headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userIds }),
    },
  );

  if (!response.ok) {
    throw await buildTaskApiError(response, "No se pudieron guardar los asignados.");
  }

  const body = await response.json();
  return body.assignees;
}
