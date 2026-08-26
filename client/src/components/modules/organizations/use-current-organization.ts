import { useOrganizations } from "./use-organizations";

export function useCurrentOrganization() {
  const { data: organizations, isLoading } = useOrganizations();
  return { organization: organizations?.[0], isLoading };
}
