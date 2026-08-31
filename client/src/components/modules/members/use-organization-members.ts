import { useQuery } from "@tanstack/react-query";
import { listOrganizationMembers } from "./list-organization-members.api";

export function useOrganizationMembers(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["/api/organizations", organizationId, "members"],
    queryFn: () => listOrganizationMembers(organizationId as string),
    enabled: organizationId !== undefined,
  });
}
