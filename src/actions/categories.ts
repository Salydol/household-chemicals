'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import type { ActionState } from './products';

async function uniqueSlug(base: string, ignoreId?: number) {
  let slug = slugify(base);
  let i = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const found = await prisma.category.findUnique({ where: { slug } });
    if (!found || found.id === ignoreId) return slug;
    slug = `${slugify(base)}-${i++}`;
  }
}

export async function saveCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdmin();

    const name = String(formData.get('name') || '').trim();
    if (name.length < 2) return { error: 'Введите название категории' };

    const idRaw = formData.get('id');
    const id = idRaw ? Number(idRaw) : null;
    const slug = await uniqueSlug(String(formData.get('slug') || '').trim() || name, id ?? undefined);

    const data = {
      name,
      slug,
      description: String(formData.get('description') || '').trim() || null,
      imageUrl: String(formData.get('imageUrl') || '').trim() || null,
      isActive: formData.get('isActive') === 'on',
      sortOrder: Number(formData.get('sortOrder') || 0) || 0,
    };

    if (id) await prisma.category.update({ where: { id }, data });
    else await prisma.category.create({ data });

    revalidatePath('/', 'layout');
    return { ok: true, message: id ? 'Категория обновлена' : 'Категория добавлена' };
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return { error: 'Требуется авторизация' };
    console.error(e);
    return { error: 'Не удалось сохранить категорию' };
  }
}

export async function deleteCategory(id: number) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath('/', 'layout');
}

export async function toggleCategoryActive(id: number) {
  await requireAdmin();
  const c = await prisma.category.findUnique({ where: { id }, select: { isActive: true } });
  if (!c) return;
  await prisma.category.update({ where: { id }, data: { isActive: !c.isActive } });
  revalidatePath('/', 'layout');
}

export async function moveCategory(id: number, direction: 'up' | 'down') {
  await requireAdmin();
  const all = await prisma.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
  const index = all.findIndex((c) => c.id === id);
  const target = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= all.length) return;

  const reordered = [...all];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

  await prisma.$transaction(
    reordered.map((c, i) => prisma.category.update({ where: { id: c.id }, data: { sortOrder: i } })),
  );
  revalidatePath('/', 'layout');
}
