import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildRolesApiError } from "./roles-api-error";

export type RoleSummary = {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
};

export async function listRoles(organizationId: string): Promise<RoleSummary[]> {
  const response = await fetch(`/api/organizations/${organizationId}/roles`, {
    credentials: "include",
    headers: buildAuthorizationHeaders(),
  });

  if (!response.ok) {
    throw await buildRolesApiError(response, "No se pudieron cargar los roles.");
  }

  const body = await response.json();
  return body.roles;
}
