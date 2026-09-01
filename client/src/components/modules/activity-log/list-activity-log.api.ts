import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildActivityLogApiError } from "./activity-log-api-error";
import type { ActivityLogEntry } from "./activity-log-entry";

export async function listActivityLog(organizationId: string): Promise<ActivityLogEntry[]> {
  const response = await fetch(`/api/organizations/${organizationId}/activity-log`, {
    credentials: "include",
    headers: buildAuthorizationHeaders(),
  });

  if (!response.ok) {
    throw await buildActivityLogApiError(response, "No se pudo cargar la actividad de la organización.");
  }

  const body = await response.json();
  return body.entries;
}
