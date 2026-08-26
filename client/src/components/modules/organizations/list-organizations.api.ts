import { buildOrganizationApiError } from "./organization-api-error";
import { buildOrganizationRequestHeaders } from "./organization-api-headers";

export type OrganizationSummary = {
  id: string;
  name: string;
  slug: string;
};

export async function listOrganizations(): Promise<OrganizationSummary[]> {
  const response = await fetch("/api/organizations", {
    credentials: "include",
    headers: buildOrganizationRequestHeaders(),
  });

  if (!response.ok) {
    throw await buildOrganizationApiError(response, "No se pudieron cargar tus organizaciones.");
  }

  const body = await response.json();
  return body.organizations;
}
