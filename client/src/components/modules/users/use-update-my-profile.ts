import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { updateMyProfile as sendUpdateMyProfileRequest, type UpdateMyProfileRequest } from "./update-my-profile.api";
import { UserApiError } from "./user-api-error";

// onError is deliberately NOT set here: the name form wants field-level errors
// while the avatar uploader wants a plain toast, so each caller supplies its
// own onError via the mutate() call instead of sharing one behavior for both.
// Same split as useUpdateOrganization (HU-12).
export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (input: UpdateMyProfileRequest) => sendUpdateMyProfileRequest(input),
    onSuccess: () => {
      invalidateMyProfile(queryClient);
      toast({
        title: "Perfil actualizado",
        description: "Los cambios se guardaron correctamente.",
      });
    },
  });

  return { updateMyProfile: mutation.mutate, isPending: mutation.isPending };
}

function invalidateMyProfile(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
}

export function describeUpdateProfileError(error: unknown): string {
  if (!(error instanceof UserApiError)) {
    return "No se pudo actualizar el perfil.";
  }
  const avatarError = error.fieldErrors?.avatar?.[0];
  const fullNameError = error.fieldErrors?.fullName?.[0];
  return avatarError ?? fullNameError ?? error.message;
}
