import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildPermissionsApiError } from "./permissions-api-error";

export type PermissionSummary = {
  id: string;
  resource: string;
  action: string;
  key: string;
};

export async function listPermissions(): Promise<PermissionSummary[]> {
  const response = await fetch("/api/permissions", {
    credentials: "include",
    headers: buildAuthorizationHeaders(),
  });

  if (!response.ok) {
    throw await buildPermissionsApiError(response, "No se pudo cargar el catálogo de permisos.");
  }

  const body = await response.json();
  return body.permissions;
}
