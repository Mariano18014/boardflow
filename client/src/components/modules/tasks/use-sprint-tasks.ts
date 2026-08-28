import { useQuery } from "@tanstack/react-query";
import { listSprintTasks } from "./list-sprint-tasks.api";

export function useSprintTasks(
  organizationId: string | undefined,
  projectId: string | undefined,
  sprintId: string | undefined,
) {
  return useQuery({
    queryKey: ["/api/projects", projectId, "sprints", sprintId, "tasks"],
    queryFn: () => listSprintTasks(organizationId as string, projectId as string, sprintId as string),
    enabled: organizationId !== undefined && projectId !== undefined && sprintId !== undefined,
  });
}
