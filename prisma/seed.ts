import { PrismaClient } from '@prisma/client';
import { seed } from './data';

const prisma = new PrismaClient();

seed(prisma)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
