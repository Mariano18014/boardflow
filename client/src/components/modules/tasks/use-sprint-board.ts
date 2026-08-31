import { useQuery } from "@tanstack/react-query";
import { getSprintBoard } from "./get-sprint-board.api";

export function useSprintBoard(
  organizationId: string | undefined,
  projectId: string | undefined,
  sprintId: string | undefined,
) {
  return useQuery({
    queryKey: ["/api/projects", projectId, "sprints", sprintId, "board"],
    queryFn: () => getSprintBoard(organizationId as string, projectId as string, sprintId as string),
    enabled: organizationId !== undefined && projectId !== undefined && sprintId !== undefined,
  });
}
