import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildUserApiError } from "./user-api-error";
import type { UserProfile } from "./profile-summary";

export type UpdateMyProfileRequest = {
  fullName?: string;
  avatarFile?: File;
};

export async function updateMyProfile(input: UpdateMyProfileRequest): Promise<UserProfile> {
  const formData = buildUpdateMyProfileFormData(input);
  const response = await fetch("/api/users/me", {
    method: "PATCH",
    headers: buildAuthorizationHeaders(),
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw await buildUserApiError(response, "No se pudo actualizar el perfil.");
  }

  const body = await response.json();
  return body.user;
}

function buildUpdateMyProfileFormData(input: UpdateMyProfileRequest): FormData {
  const formData = new FormData();
  if (input.fullName !== undefined) {
    formData.append("fullName", input.fullName);
  }
  if (input.avatarFile) {
    formData.append("avatar", input.avatarFile);
  }
  return formData;
}
