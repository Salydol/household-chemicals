import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getSettings, pricesVisible } from '@/lib/settings';
import { whatsappLink } from '@/lib/whatsapp';
import { formatPrice, STATUS_CLASS, STATUS_LABEL } from '@/lib/utils';
import { Gallery } from '@/components/site/Gallery';
import { Breadcrumbs } from '@/components/site/Breadcrumbs';
import { ProductCard } from '@/components/site/ProductCard';
import { WhatsAppIcon } from '@/components/site/WhatsAppIcon';
import { SectionHeader } from '@/components/site/SectionHeader';

export const dynamic = 'force-dynamic';

type Params = Promise<{ slug: string }>;

async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: [{ isMain: 'desc' }, { sortOrder: 'asc' }] },
      attributes: { orderBy: { sortOrder: 'asc' } },
    },
  });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug).catch(() => null);
  if (!product) return { title: 'Товар не найден' };
  return {
    title: product.name,
    description: product.shortDescription ?? undefined,
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? undefined,
      images: product.images[0] ? [product.images[0].imageUrl] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const settings = await getSettings();
  const showPrices = pricesVisible(settings);
  const hasPrice = showPrices && product.price !== null;

  const wa = whatsappLink({
    phone: settings.whatsapp,
    baseText: settings.whatsapp_text,
    productName: product.name,
    productSlug: product.slug,
  });

  const related = await prisma.product.findMany({
    where: { isActive: true, id: { not: product.id }, categoryId: product.categoryId ?? undefined },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    take: 4,
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: [{ isMain: 'desc' }, { sortOrder: 'asc' }], take: 1 },
    },
  });

  return (
    <>
      <div className="container-site pb-10 pt-6">
        <Breadcrumbs
          items={[
            { href: '/', label: 'Главная' },
            { href: '/catalog', label: 'Каталог' },
            ...(product.category ? [{ href: `/catalog?category=${product.category.slug}`, label: product.category.name }] : []),
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <Gallery images={product.images.map((i) => i.imageUrl)} alt={product.name} />

          <div>
            {product.category && (
              <Link href={`/catalog?category=${product.category.slug}`}
                className="text-[13px] font-semibold uppercase tracking-wide text-ink-soft transition-colors hover:text-brand-600">
                {product.category.name}
              </Link>
            )}

            <h1 className="mt-2 text-[28px] font-extrabold leading-tight tracking-tight sm:text-[34px]">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {(product.price !== null || product.status !== 'IN_STOCK') && (
                <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-[12px] font-semibold ${STATUS_CLASS[product.status]}`}>
                  {STATUS_LABEL[product.status]}
                </span>
              )}
              {product.isNew && <span className="badge bg-blue-500">Новинка</span>}
              {product.isSale && <span className="badge bg-red-500">Акция</span>}
              {product.isFeatured && <span className="badge bg-brand-500">Хит</span>}
            </div>

            {product.shortDescription && (
              <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">{product.shortDescription}</p>
            )}

            <div className="mt-6 rounded-xl bg-surface p-5">
              {hasPrice ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-[32px] font-extrabold leading-none text-brand-500">{formatPrice(product.price)}</span>
                  {product.oldPrice ? (
                    <span className="text-lg font-medium text-ink-soft line-through">{formatPrice(product.oldPrice)}</span>
                  ) : null}
                </div>
              ) : (
                <div className="text-xl font-bold text-brand-600">Цена по запросу</div>
              )}

              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-lg mt-4 w-full">
                <WhatsAppIcon /> {hasPrice ? 'Заказать в WhatsApp' : 'Узнать стоимость в WhatsApp'}
              </a>
              <p className="mt-3 text-center text-[12px] leading-relaxed text-ink-muted">
                {hasPrice
                  ? 'Нажмите — откроется WhatsApp с готовым сообщением. Менеджер ответит и оформит заказ.'
                  : 'Нажмите — откроется WhatsApp с готовым сообщением. Менеджер уточнит детали и назовёт точную стоимость.'}
              </p>
            </div>

            {product.attributes.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-bold">Характеристики</h2>
                <dl className="mt-3 divide-y divide-line rounded-xl border border-line">
                  {product.attributes.map((a) => (
                    <div key={a.id} className="flex items-baseline gap-4 px-4 py-3">
                      <dt className="w-40 shrink-0 text-[13px] text-ink-muted">{a.name}</dt>
                      <dd className="text-[14px] font-semibold">{a.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {product.description && (
              <div className="mt-8">
                <h2 className="text-lg font-bold">Описание</h2>
                <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink-muted">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-site pb-6">
          <SectionHeader
            title={product.price === null ? 'Похожие услуги' : 'Похожие товары'}
            linkHref="/catalog"
            linkLabel="Весь каталог"
          />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} showPrices={showPrices}
                whatsapp={settings.whatsapp} whatsappText={settings.whatsapp_text} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
