import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildSprintApiError } from "./sprint-api-error";

export type SprintHistoryTask = {
  taskId: string;
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  estimatedPoints: number | null;
  columnId: string | null;
  columnName: string | null;
};

export type SprintClosureSnapshot = {
  sprintName: string;
  goal: string | null;
  startDate: string;
  endDate: string;
  totalCommittedPoints: number;
  completedPoints: number;
  tasks: SprintHistoryTask[];
};

export type SprintHistory =
  | { available: true; snapshot: SprintClosureSnapshot }
  | { available: false; message: string };

export async function getSprintHistory(
  organizationId: string,
  projectId: string,
  sprintId: string,
): Promise<SprintHistory> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/sprints/${sprintId}/history`,
    {
      credentials: "include",
      headers: buildAuthorizationHeaders(),
    },
  );

  if (!response.ok) {
    throw await buildSprintApiError(response, "No se pudo cargar el historial del sprint.");
  }

  return response.json();
}
