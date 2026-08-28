import { useMutation } from "@tanstack/react-query";
import type { CreateSprintBody } from "@shared/schemas/sprint.schema";
import { createSprint as sendCreateSprintRequest } from "./create-sprint.api";

export function useCreateSprint(organizationId: string, projectId: string) {
  const mutation = useMutation({
    mutationFn: (input: CreateSprintBody) => sendCreateSprintRequest(organizationId, projectId, input),
  });

  return { createSprint: mutation.mutate, isPending: mutation.isPending };
}
