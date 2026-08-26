import { buildInvitationApiError } from "./invitation-api-error";

export type InvitationDetails = {
  organizationName: string;
  email: string;
  roleName: string;
};

export async function getInvitationDetails(token: string): Promise<InvitationDetails> {
  const response = await fetch(`/api/invitations/${token}`);

  if (!response.ok) {
    throw await buildInvitationApiError(response, "No se pudo cargar la invitación.");
  }

  const body = await response.json();
  return body.invitation;
}
