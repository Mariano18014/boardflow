import type { PrismaClient } from "@prisma/client";
import {
  PERMISSION_ACTIONS,
  PERMISSION_RESOURCES,
  buildPermissionKey,
  type PermissionAction,
  type PermissionResource,
} from "../../../shared/constants/permissions";

type PermissionCatalogEntry = {
  resource: PermissionResource;
  action: PermissionAction;
  key: string;
};

export async function seedPermissions(prisma: PrismaClient) {
  const catalog = buildPermissionCatalogList();
  await upsertPermissionsInDatabase(prisma, catalog);
}

function buildPermissionCatalogList(): PermissionCatalogEntry[] {
  return PERMISSION_RESOURCES.flatMap((resource) =>
    PERMISSION_ACTIONS.map((action) => ({
      resource,
      action,
      key: buildPermissionKey(resource, action),
    })),
  );
}

async function upsertPermissionsInDatabase(prisma: PrismaClient, catalog: PermissionCatalogEntry[]) {
  for (const entry of catalog) {
    await upsertPermission(prisma, entry);
  }
}

async function upsertPermission(prisma: PrismaClient, entry: PermissionCatalogEntry) {
  await prisma.permission.upsert({
    where: { key: entry.key },
    update: {},
    create: entry,
  });
}
