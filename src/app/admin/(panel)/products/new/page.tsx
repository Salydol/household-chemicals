import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSettings, pricesVisible } from '@/lib/settings';
import { PageHeader } from '@/components/admin/PageHeader';
import { EMPTY_PRODUCT, ProductForm } from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Добавление товара' };

export default async function NewProductPage() {
  const [categories, settings] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, name: true } }),
    getSettings(),
  ]);

  return (
    <>
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-muted hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" /> К списку товаров
      </Link>
      <PageHeader title="Добавление товара" subtitle="Заполните название и фото — остальное можно дополнить позже" />
      <ProductForm initial={EMPTY_PRODUCT} categories={categories} showPrices={pricesVisible(settings)} />
    </>
  );
}
