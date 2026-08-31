import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import type { CreateRoleInput } from "@shared/schemas/role.schema";
import { createRole as sendCreateRoleRequest } from "./create-role.api";

export function useCreateRole(organizationId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: CreateRoleInput) => sendCreateRoleRequest(organizationId, input),
    onSuccess: () => {
      invalidateRolesList(queryClient, organizationId);
    },
  });

  return { createRole: mutation.mutate, isPending: mutation.isPending };
}

function invalidateRolesList(queryClient: QueryClient, organizationId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/organizations", organizationId, "roles"] });
}
