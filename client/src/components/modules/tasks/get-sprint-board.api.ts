import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildTaskApiError } from "./task-api-error";
import type { AssigneeSummary } from "./assignee-summary";
import type { LabelSummary } from "./label-summary";

export type SprintBoardTask = {
  id: string;
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  estimatedPoints: number | null;
  position: number;
  assignees: AssigneeSummary[];
  labels: LabelSummary[];
};

export type SprintBoardColumn = {
  id: string;
  name: string;
  position: number;
  wipLimit: number | null;
  tasks: SprintBoardTask[];
};

export type SprintBoardSprint = {
  id: string;
  name: string;
  goal: string | null;
  startDate: string;
  endDate: string;
  status: "PLANNED" | "ACTIVE" | "COMPLETED";
};

export type SprintBoard = {
  sprint: SprintBoardSprint;
  columns: SprintBoardColumn[];
};

export async function getSprintBoard(
  organizationId: string,
  projectId: string,
  sprintId: string,
): Promise<SprintBoard> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/sprints/${sprintId}/board`,
    {
      credentials: "include",
      headers: buildAuthorizationHeaders(),
    },
  );

  if (!response.ok) {
    throw await buildTaskApiError(response, "No se pudo cargar el tablero del sprint.");
  }

  return response.json();
}
