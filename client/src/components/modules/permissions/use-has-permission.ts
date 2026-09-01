import { useMyPermissions } from "./use-my-permissions";

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
