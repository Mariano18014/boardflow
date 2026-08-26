import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { acceptInvitation } from "./accept-invitation.api";
import { InvitationApiError } from "./invitation-api-error";

export function useAcceptInvitationOnAuth() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const acceptInvitationMutation = useMutation({
    mutationFn: (invitationToken: string) => acceptInvitation(invitationToken),
    onSuccess: () => {
      invalidateOrganizationsList(queryClient);
      navigate("/dashboard");
    },
    onError: (error) => {
      notifyInvitationAcceptanceFailed(error, toast);
      navigate("/dashboard");
    },
  });

  function acceptInvitationAfterAuth(invitationToken: string) {
    acceptInvitationMutation.mutate(invitationToken);
  }

  return { acceptInvitationAfterAuth };
}

function invalidateOrganizationsList(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ["/api/organizations"] });
}

function notifyInvitationAcceptanceFailed(
  error: unknown,
  toast: ReturnType<typeof useToast>["toast"],
) {
  const message =
    error instanceof InvitationApiError ? error.message : "No se pudo aceptar la invitación.";
  toast({
    variant: "destructive",
    title: "No se pudo unir a la organización",
    description: message,
  });
}
