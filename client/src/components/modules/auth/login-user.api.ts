import type { LoginUserInput } from "@shared/schemas/user.schema";
import { buildAuthApiError } from "./auth-api-error";
import type { SessionUser } from "./auth-session.store";

type LoginResponseBody = {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
};

export async function loginUser(input: LoginUserInput): Promise<LoginResponseBody> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await buildAuthApiError(response, "No se pudo iniciar sesión.");
  }

  return response.json();
}
