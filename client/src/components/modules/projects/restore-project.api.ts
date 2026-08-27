import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildProjectApiError } from "./project-api-error";

export type RestoredProject = {
  id: string;
  isArchived: boolean;
};

export async function restoreProject(organizationId: string, projectId: string): Promise<RestoredProject> {
  const response = await fetch(`/api/organizations/${organizationId}/projects/${projectId}/restore`, {
    method: "PATCH",
    headers: buildAuthorizationHeaders(),
    credentials: "include",
  });

  if (!response.ok) {
    throw await buildProjectApiError(response, "No se pudo restaurar el proyecto.");
  }

  const body = await response.json();
  return body.project;
}
