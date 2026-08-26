import type { ForgotPasswordInput } from "@shared/schemas/password-reset-token.schema";
import { buildAuthApiError } from "./auth-api-error";

type ForgotPasswordResponseBody = {
  message: string;
};

export async function requestPasswordReset(
  input: ForgotPasswordInput,
): Promise<ForgotPasswordResponseBody> {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await buildAuthApiError(response, "No se pudo procesar la solicitud.");
  }

  return response.json();
}
