import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildProjectApiError } from "./project-api-error";
import type { ProjectSummary } from "./list-projects.api";

export async function getProject(projectId: string): Promise<ProjectSummary> {
  const response = await fetch(`/api/projects/${projectId}`, {
    credentials: "include",
    headers: buildAuthorizationHeaders(),
  });

  if (!response.ok) {
    throw await buildProjectApiError(response, "No se pudo cargar el proyecto.");
  }

  const body = await response.json();
  return body.project;
}
