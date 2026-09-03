import Link from 'next/link';
import type { Metadata } from 'next';
import { Package, CheckCircle2, Clock, EyeOff, FolderTree, Plus, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSettings, pricesVisible } from '@/lib/settings';
import { formatDate, formatPrice, STATUS_LABEL } from '@/lib/utils';
import { PageHeader } from '@/components/admin/PageHeader';
import { ProductImage } from '@/components/site/ProductImage';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const settings = await getSettings();
  const showPrices = pricesVisible(settings);

  const [total, inStock, onOrder, hidden, categories, recent] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: 'IN_STOCK', isActive: true } }),
    prisma.product.count({ where: { status: 'ON_ORDER', isActive: true } }),
    prisma.product.count({ where: { isActive: false } }),
    prisma.category.count(),
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: {
        category: { select: { name: true } },
        images: { orderBy: [{ isMain: 'desc' }, { sortOrder: 'asc' }], take: 1 },
      },
    }),
  ]);

  const stats = [
    { label: 'Всего товаров', value: total, icon: Package, tone: 'text-brand-600 bg-brand-50' },
    { label: 'В наличии', value: inStock, icon: CheckCircle2, tone: 'text-emerald-600 bg-emerald-50' },
    { label: 'Под заказ', value: onOrder, icon: Clock, tone: 'text-amber-600 bg-amber-50' },
    { label: 'Скрыто', value: hidden, icon: EyeOff, tone: 'text-gray-500 bg-gray-100' },
    { label: 'Категорий', value: categories, icon: FolderTree, tone: 'text-blue-600 bg-blue-50' },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={`Каталог сайта «${settings.company_name}»`}
        actions={
          <Link href="/admin/products/new" className="btn-primary btn-md">
            <Plus className="h-4 w-4" /> Добавить товар
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-5">
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.tone}`}>
                <Icon className="h-5 w-5" strokeWidth={1.9} />
              </span>
              <div className="mt-4 text-[28px] font-extrabold leading-none">{s.value}</div>
              <div className="mt-1.5 text-[13px] text-ink-muted">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-[15px] font-bold">Недавно добавленные товары</h2>
          <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-muted hover:text-brand-600">
            Все товары <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-ink-muted">Товаров пока нет.</p>
            <Link href="/admin/products/new" className="btn-primary btn-md mt-4">
              <Plus className="h-4 w-4" /> Добавить первый товар
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/products/${p.id}`} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface">
                  <ProductImage src={p.images[0]?.imageUrl} alt={p.name} className="h-12 w-12 shrink-0 rounded-lg border border-line p-1" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-semibold">{p.name}</div>
                    <div className="mt-0.5 text-[12px] text-ink-muted">
                      {p.category?.name ?? 'Без категории'} · {STATUS_LABEL[p.status]}
                      {!p.isActive && ' · скрыт'}
                    </div>
                  </div>
                  {showPrices && p.price !== null && (
                    <span className="hidden shrink-0 text-[14px] font-bold text-brand-600 sm:block">{formatPrice(p.price)}</span>
                  )}
                  <span className="hidden shrink-0 text-[12px] text-ink-soft md:block">{formatDate(p.createdAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
