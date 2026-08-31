import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildTaskApiError } from "./task-api-error";
import type { TaskComment } from "./comment-summary";

export async function editComment(
  organizationId: string,
  projectId: string,
  taskId: string,
  commentId: string,
  content: string,
): Promise<TaskComment> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
    {
      method: "PATCH",
      headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content }),
    },
  );

  if (!response.ok) {
    throw await buildTaskApiError(response, "No se pudo editar el comentario.");
  }

  const body = await response.json();
  return body.comment;
}
