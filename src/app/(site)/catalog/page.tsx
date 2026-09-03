import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PackageSearch } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSettings, pricesVisible } from '@/lib/settings';
import { whatsappLink } from '@/lib/whatsapp';
import { buildOrderBy, buildWhere, PAGE_SIZE, parseQuery } from '@/lib/catalog';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/site/ProductCard';
import { CatalogSidebar, SortSelect } from '@/components/site/CatalogControls';
import { Pagination } from '@/components/site/Pagination';
import { Breadcrumbs } from '@/components/site/Breadcrumbs';
import { Advantages } from '@/components/site/Advantages';
import { CtaBanner } from '@/components/site/CtaBanner';
import { WhatsAppIcon } from '@/components/site/WhatsAppIcon';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Каталог',
  description: 'Каталог продукции и услуг',
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function plural(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'товар';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'товара';
  return 'товаров';
}

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const query = parseQuery(sp);
  const page = query.page ?? 1;

  const settings = await getSettings();
  const showPrices = pricesVisible(settings);
  const helpWa = whatsappLink({ phone: settings.whatsapp, baseText: settings.whatsapp_text });

  const where = buildWhere(query);

  const [categories, total, products, advantages] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: buildOrderBy(query.sort),
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        category: { select: { name: true, slug: true } },
        images: { orderBy: [{ isMain: 'desc' }, { sortOrder: 'asc' }], take: 1 },
      },
    }),
    prisma.advantage.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const makeHref = (p: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(sp)) {
      if (key === 'page' || value === undefined) continue;
      params.set(key, Array.isArray(value) ? value.join(',') : value);
    }
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return qs ? `/catalog?${qs}` : '/catalog';
  };

  const categoryHref = (slug?: string) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(sp)) {
      if (key === 'page' || key === 'category' || value === undefined) continue;
      params.set(key, Array.isArray(value) ? value.join(',') : value);
    }
    if (slug) params.set('category', slug);
    const qs = params.toString();
    return qs ? `/catalog?${qs}` : '/catalog';
  };

  return (
    <>
      <div className="container-site pb-4 pt-6">
        <Breadcrumbs items={[{ href: '/', label: 'Главная' }, { label: 'Каталог' }]} />

        <h1 className="mt-4 text-[32px] font-extrabold tracking-tight sm:text-[40px]">Каталог</h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          Выберите категорию и найдите подходящее средство или услугу
        </p>

        {/* Категории */}
        <div className="no-scrollbar -mx-4 mt-7 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 lg:flex-wrap lg:overflow-visible">
          <Link
            href={categoryHref()}
            className={cn(
              'btn btn-md shrink-0 rounded-full',
              !query.category ? 'bg-brand-700 text-white' : 'border border-line bg-white text-ink hover:border-brand-300',
            )}
          >
            Все
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={categoryHref(c.slug)}
              className={cn(
                'btn btn-md shrink-0 rounded-full',
                query.category === c.slug ? 'bg-brand-700 text-white' : 'border border-line bg-white text-ink hover:border-brand-300',
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="container-site grid gap-6 pb-14 lg:grid-cols-[280px_1fr] lg:gap-8">
        <aside className="lg:sticky lg:top-[88px] lg:self-start">
          <Suspense fallback={<div className="card h-64 animate-pulse" />}>
            <CatalogSidebar showPrices={showPrices} />
          </Suspense>

          <div className="mt-6 hidden rounded-xl bg-brand-50 p-5 lg:block">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-600 shadow-card">
              <WhatsAppIcon />
            </span>
            <h3 className="mt-4 text-[17px] font-bold leading-snug">Нужна помощь с выбором?</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
              Напишите нам в WhatsApp — подскажем и подберём подходящий вариант.
            </p>
            <a href={helpWa} target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-sm mt-4 w-full">
              <WhatsAppIcon className="h-4 w-4" /> Написать в WhatsApp
            </a>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-ink-muted">
              Найдено: <b className="text-ink">{total}</b> {plural(total)}
            </span>
            <Suspense fallback={<div className="h-11 w-[220px] rounded-lg bg-surface" />}>
              <SortSelect showPrices={showPrices} />
            </Suspense>
          </div>

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    showPrices={showPrices}
                    whatsapp={settings.whatsapp}
                    whatsappText={settings.whatsapp_text}
                  />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} makeHref={makeHref} />
            </>
          ) : (
            <div className="card flex flex-col items-center px-6 py-16 text-center">
              <PackageSearch className="h-10 w-10 text-ink-soft" strokeWidth={1.5} />
              <h2 className="mt-4 text-lg font-bold">Ничего не найдено</h2>
              <p className="mt-2 max-w-sm text-sm text-ink-muted">
                Попробуйте изменить запрос или сбросить фильтры. А можно просто написать нам — подберём вручную.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/catalog" className="btn-outline btn-md">Сбросить фильтры</Link>
                <a href={helpWa} target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-md">
                  <WhatsAppIcon className="h-[18px] w-[18px]" /> Написать в WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <CtaBanner
        title="Не нашли нужный товар?"
        text="Напишите нам в WhatsApp — поможем подобрать подходящий вариант и ответим на все вопросы."
        whatsapp={settings.whatsapp}
        whatsappText={settings.whatsapp_text}
      />

      {advantages.length > 0 && (
        <section className="container-site pt-6">
          <Advantages items={advantages} />
        </section>
      )}
    </>
  );
}
