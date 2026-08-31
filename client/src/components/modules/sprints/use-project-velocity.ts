import { useQuery } from "@tanstack/react-query";
import { fetchProjectVelocity } from "./fetch-project-velocity.api";

export function useProjectVelocity(organizationId: string | undefined, projectId: string | undefined) {
  return useQuery({
    queryKey: ["/api/projects", projectId, "sprints", "velocity"],
    queryFn: () => fetchProjectVelocity(organizationId as string, projectId as string),
    enabled: organizationId !== undefined && projectId !== undefined,
  });
}
