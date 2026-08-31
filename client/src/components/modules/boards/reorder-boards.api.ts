import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildBoardApiError } from "./board-api-error";
import type { Board } from "./list-boards.api";

export async function reorderBoards(
  organizationId: string,
  projectId: string,
  boardIds: string[],
): Promise<Board[]> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/boards/reorder`,
    {
      method: "PATCH",
      headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ boardIds }),
    },
  );

  if (!response.ok) {
    throw await buildBoardApiError(response, "No se pudo reordenar los tableros.");
  }

  const body = await response.json();
  return body.boards;
}
