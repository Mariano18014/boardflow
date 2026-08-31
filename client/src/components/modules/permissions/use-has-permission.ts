import { useMyPermissions } from "./use-my-permissions";

// Fail-safe: while permissions are still loading, hasPermission() returns
// false for every key, so gated controls default to hidden/disabled instead
// of briefly flashing as available before the real answer arrives.
export function useHasPermission(organizationId: string | undefined) {
  const { data: permissionKeys, isLoading } = useMyPermissions(organizationId);

  function hasPermission(permissionKey: string): boolean {
    if (isLoading || !permissionKeys) {
      return false;
    }
    return permissionKeys.includes(permissionKey);
  }

  return { hasPermission, isLoading };
}
