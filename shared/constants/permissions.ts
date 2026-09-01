

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
  "activity",
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
