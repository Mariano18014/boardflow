import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildRolesApiError } from "./roles-api-error";

export async function getRolePermissions(
  organizationId: string,
  roleId: string,
): Promise<string[]> {
  const response = await fetch(`/api/organizations/${organizationId}/roles/${roleId}/permissions`, {
    credentials: "include",
    headers: buildAuthorizationHeaders(),
  });

  if (!response.ok) {
    throw await buildRolesApiError(response, "No se pudieron cargar los permisos del rol.");
  }

  const body = await response.json();
  return body.permissionIds;
}
