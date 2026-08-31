// Catalogo de permisos RBAC dinamicos — formato `recurso:accion` (ver BoardFlow.txt, Epica 2).
// Es la fuente de verdad para: (a) seedear la tabla Permission, (b) el middleware authorize.middleware.ts,
// (c) la matriz de checkboxes del frontend (modules/roles).

// HU-14 seeded 7 resources x 4 actions = 28 permissions. HU-36 added "labels"
// as an 8th resource, and HU-38 adds "comments" as a 9th — still idempotent:
// seedPermissions upserts by key, so re-running it only adds the 4 new
// comments:* permissions without touching or duplicating the previous 32.
// Resources like "invitations" are intentionally NOT included yet — add them
// here (and re-run the seed) only when a later HU actually needs them.
export const PERMISSION_RESOURCES = [
  "organizations",
  "members",
  "roles",
  "projects",
  "boards",
  "sprints",
  "tasks",
  "labels",
  "comments",
] as const;
export type PermissionResource = (typeof PERMISSION_RESOURCES)[number];

export const PERMISSION_ACTIONS = ["create", "view", "edit", "delete"] as const;
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export type PermissionKey = `${PermissionResource}:${PermissionAction}`;

export function buildPermissionKey(resource: PermissionResource, action: PermissionAction): PermissionKey {
  return `${resource}:${action}`;
}

export const PERMISSION_CATALOG: PermissionKey[] = PERMISSION_RESOURCES.flatMap((resource) =>
  PERMISSION_ACTIONS.map((action) => buildPermissionKey(resource, action)),
);
