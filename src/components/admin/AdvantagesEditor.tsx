'use client';

import { Plus, Trash2 } from 'lucide-react';
import { ICON_OPTIONS } from '@/components/site/Advantages';

export type AdvantageItem = { title: string; text: string; icon: string };

const ICON_LABEL: Record<string, string> = {
  shield: 'Щит (качество)',
  tag: 'Ценник',
  truck: 'Доставка',
  headphones: 'Поддержка',
  factory: 'Производство',
  sparkles: 'Оригинальность',
  package: 'Упаковка',
  star: 'Звезда',
};

export function AdvantagesEditor({
  value,
  onChange,
}: {
  value: AdvantageItem[];
  onChange: (items: AdvantageItem[]) => void;
}) {
  const update = (i: number, patch: Partial<AdvantageItem>) =>
    onChange(value.map((a, j) => (j === i ? { ...a, ...patch } : a)));

  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="rounded-lg border border-line bg-surface/60 p-3.5">
          <div className="flex gap-2">
            <input
              value={item.title}
              onChange={(e) => update(i, { title: e.target.value })}
              placeholder="Собственное производство"
              className="input flex-1"
              aria-label={`Преимущество ${i + 1}: заголовок`}
            />
            <select
              value={item.icon}
              onChange={(e) => update(i, { icon: e.target.value })}
              className="input w-44"
              aria-label={`Преимущество ${i + 1}: иконка`}
            >
              {ICON_OPTIONS.map((icon) => (
                <option key={icon} value={icon}>{ICON_LABEL[icon] ?? icon}</option>
              ))}
            </select>
            <button
              type="button"
              aria-label="Удалить преимущество"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="flex h-11 w-10 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-[18px] w-[18px]" />
            </button>
          </div>
          <input
            value={item.text}
            onChange={(e) => update(i, { text: e.target.value })}
            placeholder="Короткое описание"
            className="input mt-2"
            aria-label={`Преимущество ${i + 1}: описание`}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...value, { title: '', text: '', icon: 'shield' }])}
        className="btn-outline btn-sm"
      >
        <Plus className="h-4 w-4" /> Добавить преимущество
      </button>
    </div>
  );
}
