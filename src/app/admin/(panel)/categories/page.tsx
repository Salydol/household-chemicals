import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/admin/PageHeader';
import { CategoriesManager, type CategoryRow } from '@/components/admin/CategoriesManager';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Категории' };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    include: { _count: { select: { products: true } } },
  });

  const rows: CategoryRow[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    imageUrl: c.imageUrl,
    isActive: c.isActive,
    productCount: c._count.products,
  }));

  return (
    <>
      <PageHeader
        title="Категории"
        subtitle="Новая категория появляется на сайте сразу после добавления"
      />
      <CategoriesManager categories={rows} />
    </>
  );
}
