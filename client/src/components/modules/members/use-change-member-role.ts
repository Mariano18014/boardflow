import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { changeMemberRole as sendChangeMemberRoleRequest } from "./change-member-role.api";
import { MembersApiError } from "./members-api-error";

type ChangeMemberRoleVariables = {
  membershipId: string;
  roleId: string;
};

export function useChangeMemberRole(organizationId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (variables: ChangeMemberRoleVariables) =>
      sendChangeMemberRoleRequest(organizationId, variables.membershipId, variables.roleId),
    onSuccess: () => {
      invalidateMembersList(queryClient, organizationId);
      toast({
        title: "Rol actualizado",
        description: "El rol del miembro se actualizó correctamente.",
      });
    },
    onError: (error) => {
      notifyChangeMemberRoleFailed(error, toast);
    },
  });

  return { changeMemberRole: mutation.mutate, isPending: mutation.isPending };
}

function invalidateMembersList(queryClient: QueryClient, organizationId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/organizations", organizationId, "members"] });
}

function notifyChangeMemberRoleFailed(error: unknown, toast: ReturnType<typeof useToast>["toast"]) {
  const message =
    error instanceof MembersApiError ? error.message : "No se pudo cambiar el rol del miembro.";
  toast({
    variant: "destructive",
    title: "No se pudo cambiar el rol",
    description: message,
  });
}
