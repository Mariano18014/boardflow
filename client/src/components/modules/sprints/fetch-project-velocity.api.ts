import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildSprintApiError } from "./sprint-api-error";

export type SprintVelocity = {
  sprintId: string;
  name: string;
  startDate: string;
  endDate: string;
  completedPoints: number;
};

export async function fetchProjectVelocity(
  organizationId: string,
  projectId: string,
): Promise<SprintVelocity[]> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/sprints/velocity`,
    {
      credentials: "include",
      headers: buildAuthorizationHeaders(),
    },
  );

  if (!response.ok) {
    throw await buildSprintApiError(response, "No se pudo cargar la velocity del proyecto.");
  }

  const body = await response.json();
  return body.velocity;
}
