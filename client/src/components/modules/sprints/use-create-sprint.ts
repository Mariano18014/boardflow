import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import type { CreateSprintBody } from "@shared/schemas/sprint.schema";
import { createSprint as sendCreateSprintRequest } from "./create-sprint.api";

export function useCreateSprint(organizationId: string, projectId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: CreateSprintBody) => sendCreateSprintRequest(organizationId, projectId, input),
    onSuccess: () => {
      invalidateProjectSprints(queryClient, projectId);
    },
  });

  return { createSprint: mutation.mutate, isPending: mutation.isPending };
}

function invalidateProjectSprints(queryClient: QueryClient, projectId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "sprints"] });
}
