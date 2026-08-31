import { useQuery } from "@tanstack/react-query";
import { getSprintHistory } from "./get-sprint-history.api";

export function useSprintHistory(
  organizationId: string | undefined,
  projectId: string | undefined,
  sprintId: string | undefined,
) {
  return useQuery({
    queryKey: ["/api/projects", projectId, "sprints", sprintId, "history"],
    queryFn: () => getSprintHistory(organizationId as string, projectId as string, sprintId as string),
    enabled: organizationId !== undefined && projectId !== undefined && sprintId !== undefined,
  });
}
