import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildProjectApiError } from "./project-api-error";

export type ProjectSummary = {
  id: string;
  name: string;
  key: string;
  organizationId: string;
};

export async function listProjects(organizationId: string): Promise<ProjectSummary[]> {
  const response = await fetch(`/api/projects?organizationId=${organizationId}`, {
    credentials: "include",
    headers: buildAuthorizationHeaders(),
  });

  if (!response.ok) {
    throw await buildProjectApiError(response, "No se pudieron cargar los proyectos.");
  }

  const body = await response.json();
  return body.projects;
}
