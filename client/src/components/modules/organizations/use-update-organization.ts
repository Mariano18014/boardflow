import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  updateOrganization as sendUpdateOrganizationRequest,
  type UpdateOrganizationRequest,
} from "./update-organization.api";
import { OrganizationApiError } from "./organization-api-error";

// onError is deliberately NOT set here: the name form wants field-level errors
// while the logo uploader wants a plain toast, so each caller supplies its own
// onError via the mutate() call instead of sharing one behavior for both.
export function useUpdateOrganization(organizationId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (input: UpdateOrganizationRequest) =>
      sendUpdateOrganizationRequest(organizationId, input),
    onSuccess: () => {
      invalidateOrganizationsList(queryClient);
      toast({
        title: "Organización actualizada",
        description: "Los cambios se guardaron correctamente.",
      });
    },
  });

  return { updateOrganization: mutation.mutate, isPending: mutation.isPending };
}

function invalidateOrganizationsList(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ["/api/organizations"] });
}

export function describeUpdateOrganizationError(error: unknown): string {
  if (!(error instanceof OrganizationApiError)) {
    return "No se pudo actualizar la organización.";
  }
  const logoError = error.fieldErrors?.logo?.[0];
  const nameError = error.fieldErrors?.name?.[0];
  return logoError ?? nameError ?? error.message;
}
