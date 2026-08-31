import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildTaskApiError } from "./task-api-error";

export async function deleteComment(
  organizationId: string,
  projectId: string,
  taskId: string,
  commentId: string,
): Promise<void> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
    {
      method: "DELETE",
      headers: buildAuthorizationHeaders(),
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw await buildTaskApiError(response, "No se pudo eliminar el comentario.");
  }
}
