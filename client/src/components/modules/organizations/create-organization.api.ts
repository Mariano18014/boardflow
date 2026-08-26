import type { CreateOrganizationInput } from "@shared/schemas/organization.schema";
import { buildOrganizationApiError } from "./organization-api-error";
import { buildOrganizationRequestHeaders } from "./organization-api-headers";

export type CreatedOrganization = {
  id: string;
  name: string;
  slug: string;
};

export async function createOrganization(input: CreateOrganizationInput): Promise<CreatedOrganization> {
  const response = await fetch("/api/organizations", {
    method: "POST",
    headers: { ...buildOrganizationRequestHeaders(), "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await buildOrganizationApiError(response, "No se pudo crear la organización.");
  }

  const body = await response.json();
  return body.organization;
}
