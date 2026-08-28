import { useQuery } from "@tanstack/react-query";
import { fetchSprintBurndown } from "./fetch-sprint-burndown.api";

export function useSprintBurndown(
  organizationId: string | undefined,
  projectId: string | undefined,
  sprintId: string | undefined,
) {
  return useQuery({
    queryKey: ["/api/projects", projectId, "sprints", sprintId, "burndown"],
    queryFn: () => fetchSprintBurndown(organizationId as string, projectId as string, sprintId as string),
    enabled: organizationId !== undefined && projectId !== undefined && sprintId !== undefined,
  });
}
