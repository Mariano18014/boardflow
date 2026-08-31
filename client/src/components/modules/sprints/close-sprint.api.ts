import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildSprintApiError } from "./sprint-api-error";
import type { SprintSummary } from "./list-sprints.api";

export async function closeSprint(
  organizationId: string,
  projectId: string,
  sprintId: string,
): Promise<SprintSummary> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/sprints/${sprintId}/close`,
    {
      method: "PATCH",
      headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw await buildSprintApiError(response, "No se pudo cerrar el sprint.");
  }

  const body = await response.json();
  return body.sprint;
}
