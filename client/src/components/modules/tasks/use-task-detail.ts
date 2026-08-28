import { useQuery } from "@tanstack/react-query";
import { getTaskDetail } from "./get-task-detail.api";

export function useTaskDetail(
  organizationId: string | undefined,
  projectId: string | undefined,
  taskId: string | undefined,
) {
  return useQuery({
    queryKey: ["/api/projects", projectId, "tasks", taskId],
    queryFn: () => getTaskDetail(organizationId as string, projectId as string, taskId as string),
    enabled: organizationId !== undefined && projectId !== undefined && taskId !== undefined,
  });
}
