import type { ResetPasswordInput } from "@shared/schemas/password-reset-token.schema";
import { buildAuthApiError } from "./auth-api-error";

type ResetPasswordResponseBody = {
  message: string;
};

export async function resetPassword(input: ResetPasswordInput): Promise<ResetPasswordResponseBody> {
  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await buildAuthApiError(response, "No se pudo actualizar la contraseña.");
  }

  return response.json();
}
