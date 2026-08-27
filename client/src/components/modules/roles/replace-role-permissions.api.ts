import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildRolesApiError } from "./roles-api-error";

export async function replaceRolePermissions(
  organizationId: string,
  roleId: string,
  permissionIds: string[],
): Promise<string[]> {
  const response = await fetch(`/api/organizations/${organizationId}/roles/${roleId}/permissions`, {
    method: "PUT",
    headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ permissionIds }),
  });

  if (!response.ok) {
    throw await buildRolesApiError(response, "No se pudieron guardar los permisos del rol.");
  }

  const body = await response.json();
  return body.permissionIds;
}
