'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export type ActionState = { ok?: boolean; error?: string; message?: string };

const imageSchema = z.object({ imageUrl: z.string().min(1), isMain: z.boolean().optional() });
const attrSchema = z.object({ name: z.string().min(1), value: z.string().min(1) });

const schema = z.object({
  name: z.string().trim().min(2, 'Введите название товара'),
  slug: z.string().trim().optional(),
  shortDescription: z.string().trim().optional(),
  description: z.string().trim().optional(),
  price: z.string().optional(),
  oldPrice: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.enum(['IN_STOCK', 'ON_ORDER', 'OUT_OF_STOCK']),
  keywords: z.string().trim().optional(),
  sortOrder: z.string().optional(),
});

function toInt(value?: string | null) {
  if (!value) return null;
  const n = Number(String(value).replace(/\s/g, ''));
  return Number.isFinite(n) ? Math.round(n) : null;
}

async function uniqueSlug(base: string, ignoreId?: number) {
  let slug = slugify(base);
  let i = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const found = await prisma.product.findUnique({ where: { slug } });
    if (!found || found.id === ignoreId) return slug;
    slug = `${slugify(base)}-${i++}`;
  }
}

export async function saveProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let newId: number | null = null;

  try {
    await requireAdmin();

    const parsed = schema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? 'Проверьте заполнение формы' };
    }
    const data = parsed.data;

    const idRaw = formData.get('id');
    const id = idRaw ? Number(idRaw) : null;

    const images = imageSchema
      .array()
      .catch([])
      .parse(JSON.parse(String(formData.get('imagesJson') || '[]')));
    const attributes = attrSchema
      .array()
      .catch([])
      .parse(JSON.parse(String(formData.get('attributesJson') || '[]')));

    const slug = await uniqueSlug(data.slug?.trim() || data.name, id ?? undefined);

    const payload = {
      name: data.name,
      slug,
      shortDescription: data.shortDescription || null,
      description: data.description || null,
      price: toInt(data.price),
      oldPrice: toInt(data.oldPrice),
      categoryId: data.categoryId ? Number(data.categoryId) : null,
      status: data.status,
      isActive: formData.get('isActive') === 'on',
      isFeatured: formData.get('isFeatured') === 'on',
      isNew: formData.get('isNew') === 'on',
      isSale: formData.get('isSale') === 'on',
      showOnHome: formData.get('showOnHome') === 'on',
      keywords: data.keywords || null,
      sortOrder: toInt(data.sortOrder) ?? 0,
    };

    const imageRows = images.map((img, i) => ({
      imageUrl: img.imageUrl,
      isMain: i === 0,
      sortOrder: i,
    }));
    const attrRows = attributes.map((a, i) => ({ name: a.name, value: a.value, sortOrder: i }));

    if (id) {
      await prisma.$transaction([
        prisma.product.update({ where: { id }, data: payload }),
        prisma.productImage.deleteMany({ where: { productId: id } }),
        prisma.productAttribute.deleteMany({ where: { productId: id } }),
        prisma.productImage.createMany({ data: imageRows.map((r) => ({ ...r, productId: id })) }),
        prisma.productAttribute.createMany({ data: attrRows.map((r) => ({ ...r, productId: id })) }),
      ]);
    } else {
      const created = await prisma.product.create({
        data: {
          ...payload,
          images: { create: imageRows },
          attributes: { create: attrRows },
        },
      });
      newId = created.id;
    }

    revalidatePath('/', 'layout');
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') return { error: 'Требуется авторизация' };
    console.error(e);
    return { error: 'Не удалось сохранить товар. Проверьте данные и попробуйте снова.' };
  }

  if (newId) redirect(`/admin/products/${newId}?created=1`);
  return { ok: true, message: 'Товар сохранён' };
}

export async function toggleProductActive(id: number) {
  await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id }, select: { isActive: true } });
  if (!product) return;
  await prisma.product.update({ where: { id }, data: { isActive: !product.isActive } });
  revalidatePath('/', 'layout');
}

export async function deleteProduct(id: number) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath('/', 'layout');
}
