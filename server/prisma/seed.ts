import { PrismaClient } from "@prisma/client";
import { PERMISSION_ACTIONS, PERMISSION_RESOURCES, buildPermissionKey } from "../../shared/constants/permissions";

const prisma = new PrismaClient();

async function main() {
  await seedPermissions();
}

async function seedPermissions() {
  for (const resource of PERMISSION_RESOURCES) {
    for (const action of PERMISSION_ACTIONS) {
      await upsertPermission(resource, action);
    }
  }
}

async function upsertPermission(
  resource: (typeof PERMISSION_RESOURCES)[number],
  action: (typeof PERMISSION_ACTIONS)[number],
) {
  const key = buildPermissionKey(resource, action);
  await prisma.permission.upsert({
    where: { key },
    update: {},
    create: { resource, action, key },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
