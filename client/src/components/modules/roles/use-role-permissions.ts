import { useQuery } from "@tanstack/react-query";
import { getRolePermissions } from "./get-role-permissions.api";

export function useRolePermissions(organizationId: string | undefined, roleId: string | undefined) {
  return useQuery({
    queryKey: ["/api/organizations", organizationId, "roles", roleId, "permissions"],
    queryFn: () => getRolePermissions(organizationId as string, roleId as string),
    enabled: organizationId !== undefined && roleId !== undefined,
  });
}
