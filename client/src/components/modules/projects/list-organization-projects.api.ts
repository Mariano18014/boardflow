import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildProjectApiError } from "./project-api-error";

export type OrganizationProject = {
  id: string;
  name: string;
  key: string;
  description: string | null;
  isArchived: boolean;
  createdAt: string;
  boardsCount: number;
};

export async function listOrganizationProjects(
  organizationId: string,
  includeArchived: boolean,
): Promise<OrganizationProject[]> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects?includeArchived=${includeArchived}`,
    {
      credentials: "include",
      headers: buildAuthorizationHeaders(),
    },
  );

  if (!response.ok) {
    throw await buildProjectApiError(response, "No se pudieron cargar los proyectos.");
  }

  const body = await response.json();
  return body.projects;
}
