import type { CreateLabelBody } from "@shared/schemas/label.schema";
import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildLabelApiError } from "./label-api-error";
import type { ProjectLabel } from "./list-labels.api";

export async function createLabel(
  organizationId: string,
  projectId: string,
  input: CreateLabelBody,
): Promise<ProjectLabel> {
  const response = await fetch(`/api/organizations/${organizationId}/projects/${projectId}/labels`, {
    method: "POST",
    headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await buildLabelApiError(response, "No se pudo crear el label.");
  }

  const body = await response.json();
  return body.label;
}
