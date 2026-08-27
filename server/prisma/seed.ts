import { PrismaClient } from "@prisma/client";
import { seedPermissions } from "./seed/permissions.seed";

const prisma = new PrismaClient();

async function main() {
  await seedPermissions(prisma);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
