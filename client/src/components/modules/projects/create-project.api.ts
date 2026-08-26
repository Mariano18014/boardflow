import type { CreateProjectInput } from "@shared/schemas/project.schema";
import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildProjectApiError } from "./project-api-error";

export type CreatedProject = {
  id: string;
  name: string;
  key: string;
  organizationId: string;
};

export async function createProject(input: CreateProjectInput): Promise<CreatedProject> {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await buildProjectApiError(response, "No se pudo crear el proyecto.");
  }

  const body = await response.json();
  return body.project;
}
