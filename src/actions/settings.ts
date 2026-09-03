'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { SETTING_KEYS } from '@/lib/settings';
import type { ActionState } from './products';

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdmin();

    const entries = SETTING_KEYS.map((key) => ({
      key,
      value: String(formData.get(key) ?? ''),
    }));

    await prisma.$transaction(
      entries.map((e) =>
        prisma.siteSetting.upsert({
          where: { key: e.key },
          update: { value: e.value },
          create: { key: e.key, value: e.value },
        }),
      ),
    );

    revalidatePath('/', 'layout');
    return { ok: true, message: 'Настройки сохранены' };
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return { error: 'Требуется авторизация' };
    console.error(e);
    return { error: 'Не удалось сохранить настройки' };
  }
}
