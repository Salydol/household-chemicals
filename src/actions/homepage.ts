'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import type { ActionState } from './products';

const advantageSchema = z.object({
  title: z.string().trim().min(1),
  text: z.string().trim().default(''),
  icon: z.string().trim().default('shield'),
});

const FIELDS = [
  'heroTitle', 'heroAccent', 'heroSubtitle', 'heroText', 'heroImage', 'heroButtonText',
  'aboutTitle', 'aboutText', 'aboutImage',
  'aboutStat1Value', 'aboutStat1Label',
  'aboutStat2Value', 'aboutStat2Label',
  'aboutStat3Value', 'aboutStat3Label',
  'ctaTitle', 'ctaText',
] as const;

export async function saveHomeContent(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdmin();

    const data = Object.fromEntries(
      FIELDS.map((f) => [f, String(formData.get(f) ?? '')]),
    ) as Record<(typeof FIELDS)[number], string>;

    await prisma.homeContent.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });

    const advantages = advantageSchema
      .array()
      .catch([])
      .parse(JSON.parse(String(formData.get('advantagesJson') || '[]')));

    await prisma.$transaction([
      prisma.advantage.deleteMany({}),
      prisma.advantage.createMany({
        data: advantages.map((a, i) => ({ ...a, sortOrder: i, isActive: true })),
      }),
    ]);

    revalidatePath('/', 'layout');
    return { ok: true, message: 'Главная страница обновлена' };
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return { error: 'Требуется авторизация' };
    console.error(e);
    return { error: 'Не удалось сохранить контент главной' };
  }
}

export async function setShowOnHome(id: number, value: boolean) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { showOnHome: value } });
  revalidatePath('/', 'layout');
}
