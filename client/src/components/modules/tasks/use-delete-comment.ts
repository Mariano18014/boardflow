import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { deleteComment as sendDeleteCommentRequest } from "./delete-comment.api";

export function useDeleteComment(organizationId: string, projectId: string, taskId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (commentId: string) => sendDeleteCommentRequest(organizationId, projectId, taskId, commentId),
    onSuccess: () => {
      invalidateComments(queryClient, projectId, taskId);
    },
  });

  return { deleteComment: mutation.mutate, isDeletingComment: mutation.isPending };
}

function invalidateComments(queryClient: QueryClient, projectId: string, taskId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "tasks", taskId, "comments"] });
}
