import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { removeMember as sendRemoveMemberRequest } from "./remove-member.api";
import { MembersApiError } from "./members-api-error";

export function useRemoveMember(organizationId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (membershipId: string) => sendRemoveMemberRequest(organizationId, membershipId),
    onSuccess: () => {
      invalidateMembersList(queryClient, organizationId);
      toast({
        title: "Miembro removido",
        description: "Se revocó su acceso a la organización.",
      });
    },
    onError: (error) => {
      notifyRemoveMemberFailed(error, toast);
    },
  });

  return { removeMember: mutation.mutate, isPending: mutation.isPending };
}

function invalidateMembersList(queryClient: QueryClient, organizationId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/organizations", organizationId, "members"] });
}

function notifyRemoveMemberFailed(error: unknown, toast: ReturnType<typeof useToast>["toast"]) {
  const message = error instanceof MembersApiError ? error.message : "No se pudo remover al miembro.";
  toast({
    variant: "destructive",
    title: "No se pudo remover al miembro",
    description: message,
  });
}
