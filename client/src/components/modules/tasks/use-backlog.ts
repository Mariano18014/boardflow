import { useQuery } from "@tanstack/react-query";
import { listBacklogTasks } from "./list-backlog.api";

export function useBacklog(organizationId: string | undefined, projectId: string | undefined) {
  return useQuery({
    queryKey: ["/api/projects", projectId, "backlog"],
    queryFn: () => listBacklogTasks(organizationId as string, projectId as string),
    enabled: organizationId !== undefined && projectId !== undefined,
  });
}
