import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import type { Board } from "./list-boards.api";
import { reorderBoards as sendReorderBoardsRequest } from "./reorder-boards.api";

export function useReorderBoards(organizationId: string, projectId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (boardIds: string[]) => sendReorderBoardsRequest(organizationId, projectId, boardIds),
    onSuccess: (boards) => {
      updateBoardsListCache(queryClient, projectId, boards);
    },
  });

  return { reorderBoards: mutation.mutate };
}

function updateBoardsListCache(queryClient: QueryClient, projectId: string, boards: Board[]) {
  queryClient.setQueryData(["/api/projects", projectId, "boards"], boards);
}
