import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSettings, pricesVisible } from '@/lib/settings';
import { PageHeader } from '@/components/admin/PageHeader';
import { ProductForm, type ProductFormValues } from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Редактирование товара' };

type Params = Promise<{ id: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const productId = Number(id);
  if (!Number.isFinite(productId)) notFound();

  const [product, categories, settings] = await Promise.all([
    prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: { orderBy: [{ isMain: 'desc' }, { sortOrder: 'asc' }] },
        attributes: { orderBy: { sortOrder: 'asc' } },
      },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, name: true } }),
    getSettings(),
  ]);

  if (!product) notFound();

  const initial: ProductFormValues = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription ?? '',
    description: product.description ?? '',
    price: product.price?.toString() ?? '',
    oldPrice: product.oldPrice?.toString() ?? '',
    categoryId: product.categoryId?.toString() ?? '',
    status: product.status,
    keywords: product.keywords ?? '',
    sortOrder: product.sortOrder.toString(),
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    isSale: product.isSale,
    showOnHome: product.showOnHome,
    images: product.images.map((i) => i.imageUrl),
    attributes: product.attributes.map((a) => ({ name: a.name, value: a.value })),
  };

  return (
    <>
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-muted hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" /> К списку товаров
      </Link>

      {sp.created && (
        <p className="mb-4 flex items-center gap-2 rounded-lg bg-brand-50 px-3.5 py-2.5 text-[13px] font-medium text-brand-700">
          <Check className="h-4 w-4" /> Товар создан. Можно дополнить описание и характеристики.
        </p>
      )}

      <PageHeader title="Редактирование товара" subtitle={product.name} />
      <ProductForm initial={initial} categories={categories} showPrices={pricesVisible(settings)} />
    </>
  );
}
