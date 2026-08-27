import type { CreateRoleInput } from "@shared/schemas/role.schema";
import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildRolesApiError } from "./roles-api-error";
import type { RoleSummary } from "./list-roles.api";

export async function createRole(
  organizationId: string,
  input: CreateRoleInput,
): Promise<RoleSummary> {
  const response = await fetch(`/api/organizations/${organizationId}/roles`, {
    method: "POST",
    headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await buildRolesApiError(response, "No se pudo crear el rol.");
  }

  const body = await response.json();
  return body.role;
}
