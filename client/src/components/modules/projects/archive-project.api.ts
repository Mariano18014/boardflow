import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildProjectApiError } from "./project-api-error";

export type ArchivedProject = {
  id: string;
  isArchived: boolean;
};

export async function archiveProject(organizationId: string, projectId: string): Promise<ArchivedProject> {
  const response = await fetch(`/api/organizations/${organizationId}/projects/${projectId}/archive`, {
    method: "PATCH",
    headers: buildAuthorizationHeaders(),
    credentials: "include",
  });

  if (!response.ok) {
    throw await buildProjectApiError(response, "No se pudo archivar el proyecto.");
  }

  const body = await response.json();
  return body.project;
}
