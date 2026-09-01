import type { ChangePasswordInput } from "@shared/schemas/user.schema";
import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildUserApiError } from "./user-api-error";

export async function changePassword(input: ChangePasswordInput): Promise<void> {
  const response = await fetch("/api/users/me/password", {
    method: "PATCH",
    headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await buildUserApiError(response, "No se pudo cambiar la contraseña.");
  }
}
