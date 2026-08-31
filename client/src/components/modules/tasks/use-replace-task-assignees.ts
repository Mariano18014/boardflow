import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { replaceTaskAssignees as sendReplaceTaskAssigneesRequest } from "./replace-task-assignees.api";

export function useReplaceTaskAssignees(
  organizationId: string,
  projectId: string,
  taskId: string,
  sprintId: string | null,
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userIds: string[]) =>
      sendReplaceTaskAssigneesRequest(organizationId, projectId, taskId, userIds),
    onSuccess: () => {
      invalidateTaskDetail(queryClient, projectId, taskId);
      invalidateBacklogList(queryClient, projectId);
      invalidateSprintBoard(queryClient, projectId, sprintId);
    },
  });

  return {
    replaceTaskAssigneesAsync: mutation.mutateAsync,
    isReplacingAssignees: mutation.isPending,
  };
}

function invalidateTaskDetail(queryClient: QueryClient, projectId: string, taskId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "tasks", taskId] });
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
