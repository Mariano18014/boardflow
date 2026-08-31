import type { CreateInvitationInput } from "@shared/schemas/invitation.schema";
import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildInvitationApiError } from "./invitation-api-error";

export type CreatedInvitation = {
  id: string;
  email: string;
  roleId: string;
  status: string;
  expiresAt: string;
};

export async function inviteMember(
  input: CreateInvitationInput,
  organizationId: string,
): Promise<CreatedInvitation> {
  const response = await fetch(`/api/organizations/${organizationId}/invitations`, {
    method: "POST",
    headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await buildInvitationApiError(response, "No se pudo enviar la invitación.");
  }

  const body = await response.json();
  return body.invitation;
}
