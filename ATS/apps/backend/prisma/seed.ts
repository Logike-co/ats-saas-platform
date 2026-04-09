import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Fixed UUID for local dev docs and curl examples (US-002). */
export const SEED_DEV_TENANT_ID = "00000000-0000-4000-8000-000000000001";

async function main() {
  await prisma.tenant.upsert({
    where: { id: SEED_DEV_TENANT_ID },
    create: {
      id: SEED_DEV_TENANT_ID,
      name: "Dev Tenant",
      plan: "free"
    },
    update: {
      name: "Dev Tenant",
      plan: "free",
      deletedAt: null
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
