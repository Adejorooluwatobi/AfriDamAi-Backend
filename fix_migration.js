const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const result = await prisma.$executeRawUnsafe(`DELETE FROM _prisma_migrations WHERE migration_name='20260312161255_add_google_meet_fields'`);
  console.log('Deleted', result);
}
run().catch(console.error).finally(() => prisma.$disconnect());
