import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { editComment as sendEditCommentRequest } from "./edit-comment.api";

export function useEditComment(organizationId: string, projectId: string, taskId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: { commentId: string; content: string }) =>
      sendEditCommentRequest(organizationId, projectId, taskId, input.commentId, input.content),
    onSuccess: () => {
      invalidateComments(queryClient, projectId, taskId);
    },
  });

  return { editComment: mutation.mutate, isEditingComment: mutation.isPending };
}

function invalidateComments(queryClient: QueryClient, projectId: string, taskId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "tasks", taskId, "comments"] });
}
