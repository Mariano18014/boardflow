import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import type { CreateBacklogTaskBody } from "@shared/schemas/task.schema";
import type { BacklogTask } from "./list-backlog.api";
import { createBacklogTask as sendCreateBacklogTaskRequest } from "./create-backlog-task.api";

export function useCreateBacklogTask(organizationId: string, projectId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: CreateBacklogTaskBody) =>
      sendCreateBacklogTaskRequest(organizationId, projectId, input),
    onSuccess: (task) => {
      appendTaskToBacklogCache(queryClient, projectId, task);
    },
  });

  return { createBacklogTask: mutation.mutate, isPending: mutation.isPending };
}

function appendTaskToBacklogCache(queryClient: QueryClient, projectId: string, task: BacklogTask) {
  queryClient.setQueryData<BacklogTask[]>(["/api/projects", projectId, "backlog"], (currentTasks) => {
    if (!currentTasks) {
      return [task];
    }
    return [...currentTasks, task];
  });
}
