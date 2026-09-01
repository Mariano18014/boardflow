import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildNotificationApiError } from "./notification-api-error";
import type { NotificationEntry } from "./notification-entry";

export async function listNotifications(unreadOnly: boolean): Promise<NotificationEntry[]> {
  const response = await fetch(`/api/notifications?unreadOnly=${unreadOnly}`, {
    credentials: "include",
    headers: buildAuthorizationHeaders(),
  });

  if (!response.ok) {
    throw await buildNotificationApiError(response, "No se pudieron cargar las notificaciones.");
  }

  const body = await response.json();
  return body.notifications;
}
