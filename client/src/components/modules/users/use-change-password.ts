import { useMutation } from "@tanstack/react-query";
import { getSession } from "@/components/modules/auth/auth-session.store";
import { changePassword as sendChangePasswordRequest } from "./change-password.api";

type ChangeOwnPasswordInput = {
  currentPassword: string;
  newPassword: string;
};

// The form only deals with the two passwords — the current session's
// refreshToken (needed so the server keeps this session alive while revoking
// every other one) is read from the session store here, not exposed to the form.
export function useChangePassword() {
  const mutation = useMutation({
    mutationFn: (input: ChangeOwnPasswordInput) =>
      sendChangePasswordRequest({ ...input, refreshToken: getCurrentRefreshToken() }),
  });

  return { changePassword: mutation.mutate, isPending: mutation.isPending };
}

function getCurrentRefreshToken(): string {
  const session = getSession();
  return session?.refreshToken ?? "";
}
