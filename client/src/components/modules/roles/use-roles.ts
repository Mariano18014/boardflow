import { useQuery } from "@tanstack/react-query";
import { listRoles } from "./list-roles.api";

export function useRoles(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["/api/organizations", organizationId, "roles"],
    queryFn: () => listRoles(organizationId as string),
    enabled: organizationId !== undefined,
  });
}
