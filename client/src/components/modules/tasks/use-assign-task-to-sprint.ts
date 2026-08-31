import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { assignTaskToSprint as sendAssignTaskToSprintRequest } from "./assign-task-to-sprint.api";

type AssignTaskToSprintVariables = {
  taskId: string;
  sprintId: string | null;
};

export function useAssignTaskToSprint(organizationId: string, projectId: string, sprintId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (variables: AssignTaskToSprintVariables) =>
      sendAssignTaskToSprintRequest(organizationId, projectId, variables.taskId, variables.sprintId),
    onSuccess: () => {
      invalidateBacklogList(queryClient, projectId);
      invalidateSprintTasks(queryClient, projectId, sprintId);
    },
  });

  return { assignTaskToSprint: mutation.mutate };
}

function invalidateBacklogList(queryClient: QueryClient, projectId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "backlog"] });
}

function invalidateSprintTasks(queryClient: QueryClient, projectId: string, sprintId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "sprints", sprintId, "tasks"] });
}
