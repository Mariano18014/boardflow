import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildLabelApiError } from "./label-api-error";

export type ProjectLabel = {
  id: string;
  projectId: string;
  name: string;
  color: string;
};

export async function listLabels(organizationId: string, projectId: string): Promise<ProjectLabel[]> {
  const response = await fetch(`/api/organizations/${organizationId}/projects/${projectId}/labels`, {
    credentials: "include",
    headers: buildAuthorizationHeaders(),
  });

  if (!response.ok) {
    throw await buildLabelApiError(response, "No se pudieron cargar los labels.");
  }

  const body = await response.json();
  return body.labels;
}
