'use client';

import { useState, useTransition } from 'react';
import { setShowOnHome } from '@/actions/homepage';
import { cn } from '@/lib/utils';

export type PickerItem = { id: number; name: string; category: string; image: string | null; showOnHome: boolean };

export function FeaturedPicker({ products }: { products: PickerItem[] }) {
  const [items, setItems] = useState(products);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState('');

  const filtered = items.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  const selected = items.filter((p) => p.showOnHome).length;

  const toggle = (id: number, value: boolean) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, showOnHome: value } : p)));
    startTransition(async () => { await setShowOnHome(id, value); });
  };

  return (
    <div className="card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[15px] font-bold">Популярные товары на главной</h2>
          <p className="mt-1 text-[12px] text-ink-muted">
            Выбрано: {selected}. На главной показываются первые 8.{pending && ' Сохранение…'}
          </p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск товара"
          className="input sm:w-64"
        />
      </div>

      <div className="mt-4 max-h-[420px] space-y-1 overflow-y-auto pr-1">
        {filtered.map((p) => (
          <label
            key={p.id}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 transition-colors',
              p.showOnHome ? 'border-brand-300 bg-brand-50/60' : 'border-line hover:bg-surface',
            )}
          >
            <input
              type="checkbox"
              checked={p.showOnHome}
              onChange={(e) => toggle(p.id, e.target.checked)}
              className="h-[18px] w-[18px] rounded border-line text-brand-600 focus:ring-brand-400"
            />
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded border border-line bg-white">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt="" className="h-full w-full object-contain p-0.5" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold">{p.name}</div>
              <div className="text-[11px] text-ink-soft">{p.category}</div>
            </div>
          </label>
        ))}
        {filtered.length === 0 && <p className="py-6 text-center text-sm text-ink-muted">Ничего не найдено.</p>}
      </div>
    </div>
  );
}
