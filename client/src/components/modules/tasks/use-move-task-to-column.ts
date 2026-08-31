import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { moveTaskToColumn as sendMoveTaskToColumnRequest } from "./move-task-to-column.api";

type MoveTaskToColumnVariables = {
  taskId: string;
  columnId: string;
  position: number;
};

export function useMoveTaskToColumn(organizationId: string, projectId: string, sprintId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (variables: MoveTaskToColumnVariables) =>
      sendMoveTaskToColumnRequest(
        organizationId,
        projectId,
        variables.taskId,
        variables.columnId,
        variables.position,
      ),
    onSuccess: () => {
      invalidateSprintBoard(queryClient, projectId, sprintId);
    },
  });

  return { moveTaskToColumn: mutation.mutate };
}

function invalidateSprintBoard(queryClient: QueryClient, projectId: string, sprintId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "sprints", sprintId, "board"] });
}
