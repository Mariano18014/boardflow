import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildBoardApiError } from "./board-api-error";

export type UpdatedColumn = {
  id: string;
  boardId: string;
  name: string;
  position: number;
  wipLimit: number | null;
};

export async function updateColumnWipLimit(
  organizationId: string,
  projectId: string,
  columnId: string,
  wipLimit: number | null,
): Promise<UpdatedColumn> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/boards/columns/${columnId}/wip-limit`,
    {
      method: "PATCH",
      headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ wipLimit }),
    },
  );

  if (!response.ok) {
    throw await buildBoardApiError(response, "No se pudo actualizar el límite WIP de la columna.");
  }

  const body = await response.json();
  return body.column;
}
