import { buildAuthApiError } from "./auth-api-error";
import type { SessionUser } from "./auth-session.store";

type RefreshTokenResponseBody = {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
};

export async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponseBody> {
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw await buildAuthApiError(response, "No se pudo renovar la sesión.");
  }

  return response.json();
}
