import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 5990 -> "5 990 ₸" */
export function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) return null;
  return `${new Intl.NumberFormat('ru-RU').format(value)} ₸`;
}

export function formatDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

const RU_MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
  и: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  ә: 'a', ғ: 'g', қ: 'k', ң: 'n', ө: 'o', ұ: 'u', ү: 'u', һ: 'h', і: 'i',
};

export function slugify(input: string) {
  const base = input
    .toLowerCase()
    .split('')
    .map((ch) => RU_MAP[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return base || `item-${Date.now()}`;
}

export const STATUS_LABEL: Record<string, string> = {
  IN_STOCK: 'В наличии',
  ON_ORDER: 'Под заказ',
  OUT_OF_STOCK: 'Нет в наличии',
};

export const STATUS_CLASS: Record<string, string> = {
  IN_STOCK: 'bg-brand-50 text-brand-700 ring-1 ring-brand-200',
  ON_ORDER: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  OUT_OF_STOCK: 'bg-gray-100 text-ink-muted ring-1 ring-line',
};
