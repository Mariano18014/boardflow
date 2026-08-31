import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { closeSprint as sendCloseSprintRequest } from "./close-sprint.api";

export function useCloseSprint(organizationId: string, projectId: string, sprintId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => sendCloseSprintRequest(organizationId, projectId, sprintId),
    onSuccess: () => {
      invalidateProjectSprints(queryClient, projectId);
      invalidateSprintBoard(queryClient, projectId, sprintId);
      invalidateBacklogList(queryClient, projectId);
    },
  });

  return { closeSprint: mutation.mutate, isClosingSprint: mutation.isPending };
}

function invalidateProjectSprints(queryClient: QueryClient, projectId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "sprints"] });
}

function invalidateSprintBoard(queryClient: QueryClient, projectId: string, sprintId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "sprints", sprintId, "board"] });
}

function invalidateBacklogList(queryClient: QueryClient, projectId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "backlog"] });
}
