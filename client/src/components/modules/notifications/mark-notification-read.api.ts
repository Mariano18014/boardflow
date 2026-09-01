import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildNotificationApiError } from "./notification-api-error";

export async function markNotificationRead(notificationId: string): Promise<void> {
  const response = await fetch(`/api/notifications/${notificationId}/read`, {
    method: "PATCH",
    headers: buildAuthorizationHeaders(),
    credentials: "include",
  });

  if (!response.ok) {
    throw await buildNotificationApiError(response, "No se pudo marcar la notificación como leída.");
  }
}
