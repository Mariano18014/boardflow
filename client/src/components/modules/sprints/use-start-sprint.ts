import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { startSprint as sendStartSprintRequest } from "./start-sprint.api";

export function useStartSprint(organizationId: string, projectId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (sprintId: string) => sendStartSprintRequest(organizationId, projectId, sprintId),
    onSuccess: () => {
      invalidateProjectSprints(queryClient, projectId);
    },
  });

  return { startSprint: mutation.mutate, isStartingSprint: mutation.isPending };
}

function invalidateProjectSprints(queryClient: QueryClient, projectId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "sprints"] });
}
