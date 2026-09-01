import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import type { CreateLabelBody } from "@shared/schemas/label.schema";
import { createLabel as sendCreateLabelRequest } from "./create-label.api";

export function useCreateLabel(organizationId: string, projectId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: CreateLabelBody) => sendCreateLabelRequest(organizationId, projectId, input),
    onSuccess: () => {
      invalidateProjectLabels(queryClient, projectId);
    },
  });

  return { createLabel: mutation.mutate, isCreatingLabel: mutation.isPending };
}

function invalidateProjectLabels(queryClient: QueryClient, projectId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "labels"] });
}
