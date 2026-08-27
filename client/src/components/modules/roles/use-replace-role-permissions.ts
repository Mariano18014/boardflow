import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { replaceRolePermissions as sendReplaceRolePermissionsRequest } from "./replace-role-permissions.api";

export function useReplaceRolePermissions(organizationId: string, roleId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (permissionIds: string[]) =>
      sendReplaceRolePermissionsRequest(organizationId, roleId, permissionIds),
    onSuccess: () => {
      invalidateRolePermissions(queryClient, organizationId, roleId);
    },
  });

  return { replaceRolePermissions: mutation.mutate, isPending: mutation.isPending };
}

function invalidateRolePermissions(
  queryClient: QueryClient,
  organizationId: string,
  roleId: string,
) {
  queryClient.invalidateQueries({
    queryKey: ["/api/organizations", organizationId, "roles", roleId, "permissions"],
  });
}
