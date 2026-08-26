import type { RegisterUserInput } from "@shared/schemas/user.schema";
import { buildAuthApiError } from "./auth-api-error";

type RegisteredUser = {
  id: string;
  email: string;
  fullName: string;
  status: string;
};

export async function registerUser(input: RegisterUserInput): Promise<RegisteredUser> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await buildAuthApiError(response, "No se pudo completar el registro.");
  }

  const body = await response.json();
  return body.user;
}
