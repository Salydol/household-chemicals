/**
 * Полностью пересоздаёт демо-контент: удаляет все товары, категории,
 * преимущества, настройки и контент главной — и заливает заново.
 * Администраторы не трогаются.
 *
 *   npm run db:reseed
 */
import { PrismaClient } from '@prisma/client';
import { seed } from './data';

const prisma = new PrismaClient();

async function main() {
  console.log('Очищаю контент…');
  await prisma.productAttribute.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.advantage.deleteMany({});
  await prisma.siteSetting.deleteMany({});
  await prisma.homeContent.deleteMany({});

  console.log('Заливаю новый контент…');
  await seed(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
