import Link from 'next/link';
import type { Metadata } from 'next';
import { Plus, Search } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSettings, pricesVisible } from '@/lib/settings';
import { formatDate, formatPrice, STATUS_CLASS, STATUS_LABEL, cn } from '@/lib/utils';
import { PageHeader } from '@/components/admin/PageHeader';
import { ProductRowActions } from '@/components/admin/ProductRowActions';
import { ProductImage } from '@/components/site/ProductImage';
import { Pagination } from '@/components/site/Pagination';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Товары' };

const PER_PAGE = 20;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const q = one(sp.q)?.trim() ?? '';
  const category = one(sp.category) ?? '';
  const visibility = one(sp.visibility) ?? '';
  const page = Math.max(1, Number(one(sp.page)) || 1);

  const settings = await getSettings();
  const showPrices = pricesVisible(settings);

  const where = {
    ...(q ? { OR: [{ name: { contains: q, mode: 'insensitive' as const } }, { slug: { contains: q, mode: 'insensitive' as const } }] } : {}),
    ...(category ? { categoryId: Number(category) } : {}),
    ...(visibility === 'active' ? { isActive: true } : visibility === 'hidden' ? { isActive: false } : {}),
  };

  const [categories, total, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: {
        category: { select: { name: true } },
        images: { orderBy: [{ isMain: 'desc' }, { sortOrder: 'asc' }], take: 1 },
      },
    }),
  ]);

  const makeHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (category) params.set('category', category);
    if (visibility) params.set('visibility', visibility);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return qs ? `/admin/products?${qs}` : '/admin/products';
  };

  return (
    <>
      <PageHeader
        title="Товары"
        subtitle={`Всего: ${total}`}
        actions={
          <Link href="/admin/products/new" className="btn-primary btn-md">
            <Plus className="h-4 w-4" /> Добавить товар
          </Link>
        }
      />

      <form className="card mb-5 flex flex-col gap-3 p-4 sm:flex-row">
        <div className="relative flex-1">
          <input name="q" defaultValue={q} placeholder="Поиск по названию" className="input pr-10" />
          <button type="submit" aria-label="Найти" className="absolute right-0 top-0 flex h-11 w-10 items-center justify-center text-ink-muted hover:text-brand-600">
            <Search className="h-[18px] w-[18px]" />
          </button>
        </div>
        <select name="category" defaultValue={category} className="input sm:w-52">
          <option value="">Все категории</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select name="visibility" defaultValue={visibility} className="input sm:w-44">
          <option value="">Все</option>
          <option value="active">Опубликованные</option>
          <option value="hidden">Скрытые</option>
        </select>
        <button type="submit" className="btn-outline btn-md">Применить</button>
      </form>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-surface text-[12px] uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Фото</th>
                <th className="px-4 py-3 font-semibold">Название</th>
                <th className="px-4 py-3 font-semibold">Категория</th>
                {showPrices && <th className="px-4 py-3 font-semibold">Цена</th>}
                <th className="px-4 py-3 font-semibold">Статус</th>
                <th className="px-4 py-3 font-semibold">Дата</th>
                <th className="px-4 py-3 text-right font-semibold">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p) => (
                <tr key={p.id} className={cn('transition-colors hover:bg-surface/60', !p.isActive && 'opacity-60')}>
                  <td className="px-4 py-3">
                    <ProductImage src={p.images[0]?.imageUrl} alt={p.name} className="h-11 w-11 rounded-lg border border-line p-1" />
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${p.id}`} className="font-semibold hover:text-brand-600">{p.name}</Link>
                    <div className="mt-0.5 flex gap-1.5 text-[11px] text-ink-soft">
                      <span>/{p.slug}</span>
                      {!p.isActive && <span className="font-semibold text-amber-600">скрыт</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{p.category?.name ?? '—'}</td>
                  {showPrices && (
                    <td className="whitespace-nowrap px-4 py-3 font-semibold">{formatPrice(p.price) ?? '—'}</td>
                  )}
                  <td className="px-4 py-3">
                    <span className={`inline-flex whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-semibold ${STATUS_CLASS[p.status]}`}>
                      {STATUS_LABEL[p.status]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[12px] text-ink-muted">{formatDate(p.createdAt)}</td>
                  <td className="px-4 py-3">
                    <ProductRowActions id={p.id} slug={p.slug} isActive={p.isActive} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="text-sm text-ink-muted">Товары не найдены.</p>
            <Link href="/admin/products/new" className="btn-primary btn-md mt-4">
              <Plus className="h-4 w-4" /> Добавить товар
            </Link>
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / PER_PAGE))} makeHref={makeHref} />
    </>
  );
}
