import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildSprintApiError } from "./sprint-api-error";
import type { SprintSummary } from "./list-sprints.api";

export async function startSprint(
  organizationId: string,
  projectId: string,
  sprintId: string,
): Promise<SprintSummary> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/sprints/${sprintId}/start`,
    {
      method: "PATCH",
      headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw await buildSprintApiError(response, "No se pudo iniciar el sprint.");
  }

  const body = await response.json();
  return body.sprint;
}
