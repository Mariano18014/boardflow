import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildInvitationApiError } from "./invitation-api-error";

export type AcceptedMembership = {
  id: string;
  organizationId: string;
  roleId: string;
  status: string;
};

export async function acceptInvitation(token: string): Promise<AcceptedMembership> {
  const response = await fetch(`/api/invitations/${token}/accept`, {
    method: "POST",
    headers: buildAuthorizationHeaders(),
    credentials: "include",
  });

  if (!response.ok) {
    throw await buildInvitationApiError(response, "No se pudo aceptar la invitación.");
  }

  const body = await response.json();
  return body.membership;
}
