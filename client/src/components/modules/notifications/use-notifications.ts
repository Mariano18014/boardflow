import { useQuery } from "@tanstack/react-query";
import { listNotifications } from "./list-notifications.api";

export function useNotifications(unreadOnly: boolean) {
  return useQuery({
    queryKey: ["/api/notifications", { unreadOnly }],
    queryFn: () => listNotifications(unreadOnly),
  });
}
