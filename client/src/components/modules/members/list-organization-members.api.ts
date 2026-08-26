import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildMembersApiError } from "./members-api-error";

export type OrganizationMember = {
  type: "member" | "invitation";
  id: string;
  fullName: string | null;
  email: string;
  avatarUrl: string | null;
  roleName: string;
  status: string;
  sortDate: string;
};

export async function listOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
  const response = await fetch(`/api/organizations/${organizationId}/members`, {
    credentials: "include",
    headers: buildAuthorizationHeaders(),
  });

  if (!response.ok) {
    throw await buildMembersApiError(response, "No se pudo cargar el listado de miembros.");
  }

  const body = await response.json();
  return body.members;
}
