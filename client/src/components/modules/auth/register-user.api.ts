import type { RegisterUserInput } from "@shared/schemas/user.schema";
import { buildAuthApiError } from "./auth-api-error";
import type { SessionUser } from "./auth-session.store";

type RegisterResponseBody = {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
};

export async function registerUser(input: RegisterUserInput): Promise<RegisterResponseBody> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await buildAuthApiError(response, "No se pudo completar el registro.");
  }

  return response.json();
}
