import { useQuery } from "@tanstack/react-query";
import { listComments } from "./list-comments.api";

export function useComments(
  organizationId: string | undefined,
  projectId: string | undefined,
  taskId: string | undefined,
  canViewComments: boolean,
) {
  return useQuery({
    queryKey: ["/api/projects", projectId, "tasks", taskId, "comments"],
    queryFn: () => listComments(organizationId as string, projectId as string, taskId as string),
    enabled: canViewComments && organizationId !== undefined && projectId !== undefined && taskId !== undefined,
  });
}
