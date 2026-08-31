import type { CreateSprintBody } from "@shared/schemas/sprint.schema";
import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildSprintApiError } from "./sprint-api-error";

export type CreatedSprint = {
  id: string;
  projectId: string;
  name: string;
  goal: string | null;
  startDate: string;
  endDate: string;
  status: "PLANNED" | "ACTIVE" | "COMPLETED";
};

export async function createSprint(
  organizationId: string,
  projectId: string,
  input: CreateSprintBody,
): Promise<CreatedSprint> {
  const response = await fetch(`/api/organizations/${organizationId}/projects/${projectId}/sprints`, {
    method: "POST",
    headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await buildSprintApiError(response, "No se pudo crear el sprint.");
  }

  const body = await response.json();
  return body.sprint;
}
