import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { updateTaskDetails as sendUpdateTaskDetailsRequest, type UpdateTaskDetailsBody } from "./update-task-details.api";
import type { TaskDetail } from "./get-task-detail.api";

export function useUpdateTaskDetails(organizationId: string, projectId: string, taskId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (changes: UpdateTaskDetailsBody) =>
      sendUpdateTaskDetailsRequest(organizationId, projectId, taskId, changes),
    onSuccess: (task) => {
      updateTaskDetailCache(queryClient, projectId, taskId, task);
      invalidateBacklogList(queryClient, projectId);
      invalidateSprintBoard(queryClient, projectId, task.sprintId);
    },
  });

  return { updateTaskDetails: mutation.mutate, isPending: mutation.isPending };
}

function updateTaskDetailCache(queryClient: QueryClient, projectId: string, taskId: string, task: TaskDetail) {
  queryClient.setQueryData(["/api/projects", projectId, "tasks", taskId], task);
}

function invalidateBacklogList(queryClient: QueryClient, projectId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "backlog"] });
}

function invalidateSprintBoard(queryClient: QueryClient, projectId: string, sprintId: string | null) {
  if (sprintId === null) {
    return;
  }
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "sprints", sprintId, "board"] });
}
