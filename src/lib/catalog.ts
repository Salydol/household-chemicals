import type { Prisma } from '@prisma/client';

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Сначала популярные' },
  { value: 'new', label: 'Сначала новые' },
  { value: 'name', label: 'По названию' },
  { value: 'price_asc', label: 'Цена: по возрастанию' },
  { value: 'price_desc', label: 'Цена: по убыванию' },
] as const;

export const PAGE_SIZE = 12;

export type CatalogQuery = {
  q?: string;
  category?: string;
  status?: string[];
  min?: number;
  max?: number;
  sort?: string;
  page?: number;
};

export function parseQuery(sp: Record<string, string | string[] | undefined>): CatalogQuery {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const num = (v: string | undefined) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
  };
  const statusRaw = sp.status;
  const status = (Array.isArray(statusRaw) ? statusRaw : statusRaw ? statusRaw.split(',') : []).filter(
    (s) => ['IN_STOCK', 'ON_ORDER', 'OUT_OF_STOCK'].includes(s),
  );

  return {
    q: one(sp.q)?.trim() || undefined,
    category: one(sp.category) || undefined,
    status: status.length ? status : undefined,
    min: num(one(sp.min)),
    max: num(one(sp.max)),
    sort: one(sp.sort) || 'popular',
    page: Math.max(1, Number(one(sp.page)) || 1),
  };
}

export function buildWhere(query: CatalogQuery): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { isActive: true };
  const and: Prisma.ProductWhereInput[] = [];

  if (query.q) {
    const q = query.q;
    and.push({
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { shortDescription: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { keywords: { contains: q, mode: 'insensitive' } },
        { category: { name: { contains: q, mode: 'insensitive' } } },
      ],
    });
  }

  if (query.category) and.push({ category: { slug: query.category } });
  if (query.status?.length) {
    and.push({ status: { in: query.status as Prisma.EnumProductStatusFilter['in'] } });
  }
  if (query.min !== undefined) and.push({ price: { gte: query.min } });
  if (query.max !== undefined) and.push({ price: { lte: query.max } });

  if (and.length) where.AND = and;
  return where;
}

export function buildOrderBy(sort?: string): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case 'new':
      return [{ createdAt: 'desc' }];
    case 'name':
      return [{ name: 'asc' }];
    case 'price_asc':
      return [{ price: { sort: 'asc', nulls: 'last' } }, { name: 'asc' }];
    case 'price_desc':
      return [{ price: { sort: 'desc', nulls: 'last' } }, { name: 'asc' }];
    default:
      return [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }];
  }
}
