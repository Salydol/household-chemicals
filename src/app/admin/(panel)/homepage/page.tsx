import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/admin/PageHeader';
import { HomeContentForm, type HomeValues } from '@/components/admin/HomeContentForm';
import { FeaturedPicker, type PickerItem } from '@/components/admin/FeaturedPicker';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Главная страница' };

export default async function AdminHomePage() {
  const [home, advantages, products] = await Promise.all([
    prisma.homeContent.findUnique({ where: { id: 1 } }),
    prisma.advantage.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
        images: { orderBy: [{ isMain: 'desc' }, { sortOrder: 'asc' }], take: 1 },
      },
    }),
  ]);

  const initial: HomeValues = {
    heroTitle: home?.heroTitle ?? '',
    heroAccent: home?.heroAccent ?? '',
    heroSubtitle: home?.heroSubtitle ?? '',
    heroText: home?.heroText ?? '',
    heroImage: home?.heroImage ?? '',
    heroButtonText: home?.heroButtonText ?? 'Смотреть каталог',
    aboutTitle: home?.aboutTitle ?? 'О компании',
    aboutText: home?.aboutText ?? '',
    aboutImage: home?.aboutImage ?? '',
    aboutStat1Value: home?.aboutStat1Value ?? '',
    aboutStat1Label: home?.aboutStat1Label ?? '',
    aboutStat2Value: home?.aboutStat2Value ?? '',
    aboutStat2Label: home?.aboutStat2Label ?? '',
    aboutStat3Value: home?.aboutStat3Value ?? '',
    aboutStat3Label: home?.aboutStat3Label ?? '',
    ctaTitle: home?.ctaTitle ?? '',
    ctaText: home?.ctaText ?? '',
  };

  const pickerItems: PickerItem[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category?.name ?? 'Без категории',
    image: p.images[0]?.imageUrl ?? null,
    showOnHome: p.showOnHome,
  }));

  return (
    <>
      <PageHeader title="Главная страница" subtitle="Тексты и изображения главной меняются здесь" />
      <div className="space-y-6">
        <FeaturedPicker products={pickerItems} />
        <HomeContentForm
          initial={initial}
          advantages={advantages.map((a) => ({ title: a.title, text: a.text, icon: a.icon }))}
        />
      </div>
    </>
  );
}
