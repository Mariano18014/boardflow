import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildMembersApiError } from "./members-api-error";

export type ChangedMembership = {
  id: string;
  roleId: string;
  roleName: string;
  status: string;
};

export async function changeMemberRole(
  organizationId: string,
  membershipId: string,
  roleId: string,
): Promise<ChangedMembership> {
  const response = await fetch(`/api/organizations/${organizationId}/members/${membershipId}`, {
    method: "PATCH",
    headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ roleId }),
  });

  if (!response.ok) {
    throw await buildMembersApiError(response, "No se pudo cambiar el rol del miembro.");
  }

  const body = await response.json();
  return body.membership;
}
