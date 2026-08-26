import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildOrganizationApiError } from "./organization-api-error";

export type UpdatedOrganization = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  roleName?: string;
};

export type UpdateOrganizationRequest = {
  name?: string;
  logoFile?: File;
};

export async function updateOrganization(
  organizationId: string,
  input: UpdateOrganizationRequest,
): Promise<UpdatedOrganization> {
  const formData = buildUpdateOrganizationFormData(input);
  const response = await fetch(`/api/organizations/${organizationId}`, {
    method: "PATCH",
    headers: buildAuthorizationHeaders(),
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw await buildOrganizationApiError(response, "No se pudo actualizar la organización.");
  }

  const body = await response.json();
  return body.organization;
}

function buildUpdateOrganizationFormData(input: UpdateOrganizationRequest): FormData {
  const formData = new FormData();
  if (input.name !== undefined) {
    formData.append("name", input.name);
  }
  if (input.logoFile) {
    formData.append("logo", input.logoFile);
  }
  return formData;
}
