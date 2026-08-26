import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildOrganizationApiError } from "./organization-api-error";

export type OrganizationSummary = {
  id: string;
  name: string;
  slug: string;
};

export async function listOrganizations(): Promise<OrganizationSummary[]> {
  const response = await fetch("/api/organizations", {
    credentials: "include",
    headers: buildAuthorizationHeaders(),
  });

  if (!response.ok) {
    throw await buildOrganizationApiError(response, "No se pudieron cargar tus organizaciones.");
  }

  const body = await response.json();
  return body.organizations;
}
