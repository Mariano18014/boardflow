import { useQuery } from "@tanstack/react-query";
import { getMyPermissions } from "./get-my-permissions.api";

export function useMyPermissions(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["/api/organizations", organizationId, "members", "me", "permissions"],
    queryFn: () => getMyPermissions(organizationId as string),
    enabled: organizationId !== undefined,
  });
}
