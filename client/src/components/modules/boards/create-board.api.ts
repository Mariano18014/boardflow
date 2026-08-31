import type { CreateBoardBody } from "@shared/schemas/board.schema";
import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildBoardApiError } from "./board-api-error";

export type CreatedBoard = {
  id: string;
  projectId: string;
  name: string;
  position: number;
  isArchived: boolean;
};

export async function createBoard(
  organizationId: string,
  projectId: string,
  input: CreateBoardBody,
): Promise<CreatedBoard> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/boards`,
    {
      method: "POST",
      headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    throw await buildBoardApiError(response, "No se pudo crear el tablero.");
  }

  const body = await response.json();
  return body.board;
}
