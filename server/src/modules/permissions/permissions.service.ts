import { findAllPermissions } from "./permissions.repository";

export async function getPermissionCatalog() {
  return findAllPermissions();
}
