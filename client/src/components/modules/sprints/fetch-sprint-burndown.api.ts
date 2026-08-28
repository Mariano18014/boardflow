import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildSprintApiError } from "./sprint-api-error";

export type BurndownPoint = {
  date: string;
  remainingPoints: number;
};

export type SprintBurndown = {
  sprint: {
    name: string;
    startDate: string;
    endDate: string;
  };
  totalCommittedPoints: number;
  idealLine: BurndownPoint[];
  actualLine: BurndownPoint[];
};

export async function fetchSprintBurndown(
  organizationId: string,
  projectId: string,
  sprintId: string,
): Promise<SprintBurndown> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/sprints/${sprintId}/burndown`,
    {
      credentials: "include",
      headers: buildAuthorizationHeaders(),
    },
  );

  if (!response.ok) {
    throw await buildSprintApiError(response, "No se pudo cargar el burndown del sprint.");
  }

  return response.json();
}
