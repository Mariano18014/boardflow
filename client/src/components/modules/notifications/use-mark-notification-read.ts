import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationRead as sendMarkNotificationReadRequest } from "./mark-notification-read.api";

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (notificationId: string) => sendMarkNotificationReadRequest(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  return { markNotificationRead: mutation.mutate };
}
