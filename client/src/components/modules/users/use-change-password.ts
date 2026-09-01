import { useMutation } from "@tanstack/react-query";
import { getSession } from "@/components/modules/auth/auth-session.store";
import { changePassword as sendChangePasswordRequest } from "./change-password.api";

type ChangeOwnPasswordInput = {
  currentPassword: string;
  newPassword: string;
};

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
