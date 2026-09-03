'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { SORT_OPTIONS } from '@/lib/catalog';
import { cn } from '@/lib/utils';

const STATUSES = [
  { value: 'IN_STOCK', label: 'В наличии' },
  { value: 'ON_ORDER', label: 'Под заказ' },
];

function useUpdateParams() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  return useCallback(
    (patch: Record<string, string | string[] | undefined>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(patch)) {
        next.delete(key);
        if (Array.isArray(value)) {
          if (value.length) next.set(key, value.join(','));
        } else if (value) {
          next.set(key, value);
        }
      }
      next.delete('page');
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );
}

export function SortSelect({ showPrices }: { showPrices: boolean }) {
  const params = useSearchParams();
  const update = useUpdateParams();
  const options = showPrices ? SORT_OPTIONS : SORT_OPTIONS.filter((o) => !o.value.startsWith('price'));

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Сортировка</span>
      <select
        value={params.get('sort') ?? 'popular'}
        onChange={(e) => update({ sort: e.target.value })}
        className="input h-11 w-full min-w-[220px] cursor-pointer appearance-none pr-9"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3 h-4 w-4 text-ink-muted" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}

export function CatalogSidebar({ showPrices }: { showPrices: boolean }) {
  const params = useSearchParams();
  const update = useUpdateParams();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(params.get('q') ?? '');
  const [min, setMin] = useState(params.get('min') ?? '');
  const [max, setMax] = useState(params.get('max') ?? '');

  useEffect(() => {
    setQ(params.get('q') ?? '');
    setMin(params.get('min') ?? '');
    setMax(params.get('max') ?? '');
  }, [params]);

  const activeStatuses = (params.get('status') ?? '').split(',').filter(Boolean);
  const hasFilters = Boolean(params.get('q') || params.get('min') || params.get('max') || params.get('status'));

  const toggleStatus = (value: string) => {
    const next = activeStatuses.includes(value)
      ? activeStatuses.filter((s) => s !== value)
      : [...activeStatuses, value];
    update({ status: next });
  };

  const body = (
    <div className="space-y-6">
      <div className="card p-5">
        <h3 className="mb-3 text-[15px] font-bold">Поиск товаров</h3>
        <form
          onSubmit={(e) => { e.preventDefault(); update({ q }); setOpen(false); }}
          className="relative"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Введите название..."
            className="input pr-10"
            aria-label="Поиск товара"
          />
          <button type="submit" aria-label="Найти" className="absolute right-0 top-0 flex h-11 w-10 items-center justify-center text-ink-muted hover:text-brand-600">
            <Search className="h-[18px] w-[18px]" />
          </button>
        </form>

        {showPrices && (
          <>
            <h3 className="mb-3 mt-6 text-[15px] font-bold">Цена, ₸</h3>
            <form
              onSubmit={(e) => { e.preventDefault(); update({ min, max }); setOpen(false); }}
              className="flex items-center gap-2"
            >
              <input value={min} onChange={(e) => setMin(e.target.value)} inputMode="numeric" placeholder="от" className="input" aria-label="Цена от" />
              <input value={max} onChange={(e) => setMax(e.target.value)} inputMode="numeric" placeholder="до" className="input" aria-label="Цена до" />
              <button type="submit" className="btn-primary btn-md px-3.5">OK</button>
            </form>
          </>
        )}

        <h3 className="mb-3 mt-6 text-[15px] font-bold">Наличие</h3>
        <div className="space-y-2.5">
          {STATUSES.map((s) => (
            <label key={s.value} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={activeStatuses.includes(s.value)}
                onChange={() => toggleStatus(s.value)}
                className="h-[18px] w-[18px] cursor-pointer rounded border-line text-brand-600 focus:ring-brand-400"
              />
              <span>{s.label}</span>
            </label>
          ))}
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={() => update({ q: undefined, min: undefined, max: undefined, status: undefined })}
            className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-muted hover:text-brand-600"
          >
            <X className="h-4 w-4" /> Сбросить фильтры
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn('btn-outline btn-md w-full lg:hidden', hasFilters && 'border-brand-300 text-brand-700')}
      >
        <SlidersHorizontal className="h-4 w-4" /> Фильтры
      </button>

      <div className="hidden lg:block">{body}</div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-2xl bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-base font-bold">Фильтры</span>
              <button type="button" aria-label="Закрыть" onClick={() => setOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            {body}
          </div>
        </div>
      )}
    </>
  );
}
