import { useQuery } from "@tanstack/react-query";
import { useAuthSession } from "@/components/modules/auth/use-auth-session";
import { listOrganizations } from "./list-organizations.api";

export function useOrganizations() {
  const session = useAuthSession();
  return useQuery({
    queryKey: ["/api/organizations"],
    queryFn: listOrganizations,
    enabled: session !== null,
  });
}
