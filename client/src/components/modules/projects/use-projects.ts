import { useQuery } from "@tanstack/react-query";
import { listProjects } from "./list-projects.api";

export function useProjects(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["/api/projects", organizationId],
    queryFn: () => listProjects(organizationId as string),
    enabled: organizationId !== undefined,
  });
}
