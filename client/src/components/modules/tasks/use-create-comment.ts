import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { createComment as sendCreateCommentRequest } from "./create-comment.api";

export function useCreateComment(organizationId: string, projectId: string, taskId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (content: string) => sendCreateCommentRequest(organizationId, projectId, taskId, content),
    onSuccess: () => {
      invalidateComments(queryClient, projectId, taskId);
    },
  });

  return { createComment: mutation.mutate, isCreatingComment: mutation.isPending };
}

function invalidateComments(queryClient: QueryClient, projectId: string, taskId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "tasks", taskId, "comments"] });
}
