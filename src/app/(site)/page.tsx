import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSettings, pricesVisible } from '@/lib/settings';
import { whatsappLink } from '@/lib/whatsapp';
import { ProductCard } from '@/components/site/ProductCard';
import { CategoryCard } from '@/components/site/CategoryCard';
import { Advantages } from '@/components/site/Advantages';
import { CtaBanner } from '@/components/site/CtaBanner';
import { SectionHeader } from '@/components/site/SectionHeader';
import { WhatsAppIcon } from '@/components/site/WhatsAppIcon';
import { ProductImage } from '@/components/site/ProductImage';

export const dynamic = 'force-dynamic';

const HERO_ICONS = [ShieldCheck, Sparkles, Truck];

export default async function HomePage() {
  const settings = await getSettings();
  const showPrices = pricesVisible(settings);
  const wa = whatsappLink({ phone: settings.whatsapp, baseText: settings.whatsapp_text });

  const [home, categories, featured, advantages] = await Promise.all([
    prisma.homeContent.findUnique({ where: { id: 1 } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' }, take: 10 }),
    prisma.product.findMany({
      where: { isActive: true, showOnHome: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: 8,
      include: { category: { select: { name: true, slug: true } }, images: { orderBy: [{ isMain: 'desc' }, { sortOrder: 'asc' }], take: 1 } },
    }),
    prisma.advantage.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
  ]);

  return (
    <>
      {/* ---------- Первый экран ---------- */}
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-br from-brand-50 via-white to-surface">
        <div className="container-site grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_1fr] lg:py-16">
          <div>
            <h1 className="text-[34px] font-extrabold leading-[1.12] tracking-tight sm:text-[44px] lg:text-[52px]">
              {home?.heroTitle || 'Каталог продукции'}
              {home?.heroAccent ? <><br /><span className="text-brand-500">{home.heroAccent}</span></> : null}
              {home?.heroSubtitle ? <><br />{home.heroSubtitle}</> : null}
            </h1>

            {home?.heroText && (
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-muted sm:text-base">
                {home.heroText}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/catalog" className="btn-primary btn-lg">
                {home?.heroButtonText || 'Смотреть каталог'} <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-outline btn-lg">
                <WhatsAppIcon className="h-[18px] w-[18px] text-whatsapp" /> Написать в WhatsApp
              </a>
            </div>

            {advantages.length > 0 && (
              <ul className="mt-9 grid gap-3 sm:grid-cols-3">
                {advantages.slice(0, 3).map((a, i) => {
                  const Icon = HERO_ICONS[i] ?? ShieldCheck;
                  return (
                    <li key={a.id} className="flex items-start gap-2.5 rounded-xl bg-white/80 px-3.5 py-2.5 shadow-card ring-1 ring-line">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" strokeWidth={1.8} />
                      <span className="leading-tight">
                        <span className="block text-[13px] font-bold">{a.title}</span>
                        <span className="block text-[11px] text-ink-muted">{a.text}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-6 rounded-full bg-brand-100/60 blur-3xl" />
            <ProductImage
              src={home?.heroImage || null}
              alt={settings.company_name}
              className="relative aspect-[4/3] w-full rounded-2xl bg-transparent"
              eager
            />
          </div>
        </div>
      </section>

      {/* ---------- Категории ---------- */}
      {categories.length > 0 && (
        <section className="container-site py-14">
          <SectionHeader title="Категории" linkHref="/catalog" linkLabel="Смотреть все категории" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </section>
      )}

      {/* ---------- Популярные товары ---------- */}
      {featured.length > 0 && (
        <section className="container-site pb-14">
          <SectionHeader title="Популярные товары" linkHref="/catalog" linkLabel="Смотреть все товары" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                showPrices={showPrices}
                whatsapp={settings.whatsapp}
                whatsappText={settings.whatsapp_text}
              />
            ))}
          </div>
        </section>
      )}

      {/* ---------- Преимущества ---------- */}
      {advantages.length > 0 && (
        <section className="container-site pb-14">
          <Advantages items={advantages} />
        </section>
      )}

      {/* ---------- О компании ---------- */}
      {home && (
        <section className="container-site pb-16">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <ProductImage
              src={home.aboutImage || null}
              alt={home.aboutTitle}
              className="aspect-[4/3] w-full rounded-2xl bg-surface"
            />
            <div>
              <h2 className="section-title">{home.aboutTitle}</h2>
              <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-ink-muted">
                {home.aboutText}
              </p>

              <div className="mt-7 grid grid-cols-3 gap-4">
                {[
                  [home.aboutStat1Value, home.aboutStat1Label],
                  [home.aboutStat2Value, home.aboutStat2Label],
                  [home.aboutStat3Value, home.aboutStat3Label],
                ]
                  .filter(([v]) => v)
                  .map(([value, label]) => (
                    <div key={label}>
                      <div className="text-xl font-extrabold text-brand-600 sm:text-2xl">{value}</div>
                      <div className="mt-0.5 text-[13px] text-ink-muted">{label}</div>
                    </div>
                  ))}
              </div>

              <Link href="/about" className="btn-primary btn-md mt-8">
                Узнать больше о компании <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Финальный блок ---------- */}
      <CtaBanner
        title={home?.ctaTitle || 'Не нашли подходящий товар?'}
        text={home?.ctaText || 'Напишите нам в WhatsApp — поможем с выбором.'}
        whatsapp={settings.whatsapp}
        whatsappText={settings.whatsapp_text}
      />
    </>
  );
}
