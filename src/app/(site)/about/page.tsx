import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import { Breadcrumbs } from '@/components/site/Breadcrumbs';
import { Advantages } from '@/components/site/Advantages';
import { CtaBanner } from '@/components/site/CtaBanner';
import { ProductImage } from '@/components/site/ProductImage';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: s.about_page_title || 'О компании' };
}

export default async function AboutPage() {
  const settings = await getSettings();
  const [home, advantages] = await Promise.all([
    prisma.homeContent.findUnique({ where: { id: 1 } }),
    prisma.advantage.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
  ]);

  const stats = [
    [home?.aboutStat1Value, home?.aboutStat1Label],
    [home?.aboutStat2Value, home?.aboutStat2Label],
    [home?.aboutStat3Value, home?.aboutStat3Label],
  ].filter(([v]) => v);

  return (
    <>
      <div className="container-site pb-12 pt-6">
        <Breadcrumbs items={[{ href: '/', label: 'Главная' }, { label: 'О компании' }]} />

        <h1 className="mt-4 text-[32px] font-extrabold tracking-tight sm:text-[40px]">
          {settings.about_page_title || 'О компании'}
        </h1>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-14">
          <div className="whitespace-pre-line text-[16px] leading-relaxed text-ink-muted">
            {settings.about_page_text || home?.aboutText || 'Информация о компании появится здесь.'}
          </div>

          <ProductImage
            src={home?.aboutImage || null}
            alt={settings.company_name}
            className="aspect-[4/3] w-full rounded-2xl bg-surface"
          />
        </div>

        {stats.length > 0 && (
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-3">
            {stats.map(([value, label]) => (
              <div key={label} className="bg-surface px-6 py-8 text-center">
                <div className="text-3xl font-extrabold text-brand-600">{value}</div>
                <div className="mt-1 text-sm text-ink-muted">{label}</div>
              </div>
            ))}
          </div>
        )}

        {advantages.length > 0 && (
          <div className="mt-12">
            <h2 className="section-title mb-6">Почему выбирают нас</h2>
            <Advantages items={advantages} />
          </div>
        )}

        <Link href="/catalog" className="btn-primary btn-lg mt-12">
          Перейти в каталог <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <CtaBanner
        title="Остались вопросы?"
        text="Напишите нам в WhatsApp, и мы с радостью поможем."
        whatsapp={settings.whatsapp}
        whatsappText={settings.whatsapp_text}
      />
    </>
  );
}
