import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { updateColumnWipLimit as sendUpdateColumnWipLimitRequest } from "./update-column-wip-limit.api";

type UpdateColumnWipLimitVariables = {
  columnId: string;
  wipLimit: number | null;
};

export function useUpdateColumnWipLimit(organizationId: string, projectId: string, sprintId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (variables: UpdateColumnWipLimitVariables) =>
      sendUpdateColumnWipLimitRequest(organizationId, projectId, variables.columnId, variables.wipLimit),
    onSuccess: () => {
      invalidateSprintBoard(queryClient, projectId, sprintId);
    },
  });

  return { updateColumnWipLimit: mutation.mutate, isUpdatingWipLimit: mutation.isPending };
}

function invalidateSprintBoard(queryClient: QueryClient, projectId: string, sprintId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "sprints", sprintId, "board"] });
}
