import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildUserApiError } from "./user-api-error";
import type { UserProfile } from "./profile-summary";

export async function getMyProfile(): Promise<UserProfile> {
  const response = await fetch("/api/users/me", {
    credentials: "include",
    headers: buildAuthorizationHeaders(),
  });

  if (!response.ok) {
    throw await buildUserApiError(response, "No se pudo cargar el perfil.");
  }

  const body = await response.json();
  return body.user;
}
