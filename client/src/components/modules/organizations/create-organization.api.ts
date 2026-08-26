import type { CreateOrganizationInput } from "@shared/schemas/organization.schema";
import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildOrganizationApiError } from "./organization-api-error";

export type CreatedOrganization = {
  id: string;
  name: string;
  slug: string;
};

export async function createOrganization(input: CreateOrganizationInput): Promise<CreatedOrganization> {
  const response = await fetch("/api/organizations", {
    method: "POST",
    headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await buildOrganizationApiError(response, "No se pudo crear la organización.");
  }

  const body = await response.json();
  return body.organization;
}
