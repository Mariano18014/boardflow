import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildPermissionsApiError } from "./permissions-api-error";

export async function getMyPermissions(organizationId: string): Promise<string[]> {
  const response = await fetch(`/api/organizations/${organizationId}/members/me/permissions`, {
    credentials: "include",
    headers: buildAuthorizationHeaders(),
  });

  if (!response.ok) {
    throw await buildPermissionsApiError(response, "No se pudieron cargar tus permisos.");
  }

  const body = await response.json();
  return body.permissionKeys;
}
