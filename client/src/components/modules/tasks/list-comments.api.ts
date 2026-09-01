import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildTaskApiError } from "./task-api-error";
import type { TaskComment } from "./comment-summary";

export async function listComments(
  organizationId: string,
  projectId: string,
  taskId: string,
): Promise<TaskComment[]> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/tasks/${taskId}/comments`,
    {
      credentials: "include",
      headers: buildAuthorizationHeaders(),
    },
  );

  if (!response.ok) {
    throw await buildTaskApiError(response, "No se pudieron cargar los comentarios.");
  }

  const body = await response.json();
  return body.comments;
}
