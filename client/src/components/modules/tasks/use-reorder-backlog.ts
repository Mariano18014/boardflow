import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import type { BacklogTask } from "./list-backlog.api";
import { reorderBacklogTasks as sendReorderBacklogTasksRequest } from "./reorder-backlog.api";

export function useReorderBacklog(organizationId: string, projectId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (taskIds: string[]) =>
      sendReorderBacklogTasksRequest(organizationId, projectId, taskIds),
    onSuccess: (tasks) => {
      updateBacklogCache(queryClient, projectId, tasks);
    },
  });

  return { reorderBacklogTasks: mutation.mutate };
}

function updateBacklogCache(queryClient: QueryClient, projectId: string, tasks: BacklogTask[]) {
  queryClient.setQueryData(["/api/projects", projectId, "backlog"], tasks);
}
