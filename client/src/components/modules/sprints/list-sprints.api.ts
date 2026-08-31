import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildSprintApiError } from "./sprint-api-error";

export type SprintStatusValue = "PLANNED" | "ACTIVE" | "COMPLETED";

export type SprintSummary = {
  id: string;
  projectId: string;
  name: string;
  goal: string | null;
  startDate: string;
  endDate: string;
  status: SprintStatusValue;
};

export async function listSprints(
  organizationId: string,
  projectId: string,
  status?: SprintStatusValue,
): Promise<SprintSummary[]> {
  const query = status ? `?status=${status}` : "";
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/sprints${query}`,
    {
      credentials: "include",
      headers: buildAuthorizationHeaders(),
    },
  );

  if (!response.ok) {
    throw await buildSprintApiError(response, "No se pudieron cargar los sprints.");
  }

  const body = await response.json();
  return body.sprints;
}
