import { useQuery } from "@tanstack/react-query";
import { listOrganizationProjects } from "./list-organization-projects.api";

export function useOrganizationProjects(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["/api/organizations", organizationId, "projects", { includeArchived: true }],
    queryFn: () => listOrganizationProjects(organizationId as string, true),
    enabled: organizationId !== undefined,
  });
}
