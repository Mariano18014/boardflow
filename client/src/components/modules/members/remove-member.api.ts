import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildMembersApiError } from "./members-api-error";

export type RemovedMembership = {
  id: string;
  roleId: string;
  roleName: string;
  status: string;
};

export async function removeMember(
  organizationId: string,
  membershipId: string,
): Promise<RemovedMembership> {
  const response = await fetch(`/api/organizations/${organizationId}/members/${membershipId}`, {
    method: "DELETE",
    headers: buildAuthorizationHeaders(),
    credentials: "include",
  });

  if (!response.ok) {
    throw await buildMembersApiError(response, "No se pudo remover al miembro.");
  }

  const body = await response.json();
  return body.membership;
}
