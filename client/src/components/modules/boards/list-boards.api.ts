import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildBoardApiError } from "./board-api-error";

export type Board = {
  id: string;
  projectId: string;
  name: string;
  position: number;
  isArchived: boolean;
  createdAt: string;
};

export async function listBoards(organizationId: string, projectId: string): Promise<Board[]> {
  const response = await fetch(`/api/organizations/${organizationId}/projects/${projectId}/boards`, {
    credentials: "include",
    headers: buildAuthorizationHeaders(),
  });

  if (!response.ok) {
    throw await buildBoardApiError(response, "No se pudieron cargar los tableros.");
  }

  const body = await response.json();
  return body.boards;
}
