'use client';

import { GripVertical, Plus, Trash2 } from 'lucide-react';

export type Attribute = { name: string; value: string };

export function AttributesEditor({
  value,
  onChange,
}: {
  value: Attribute[];
  onChange: (attrs: Attribute[]) => void;
}) {
  const update = (i: number, patch: Partial<Attribute>) =>
    onChange(value.map((a, j) => (j === i ? { ...a, ...patch } : a)));

  return (
    <div>
      <span className="label">Характеристики</span>

      <div className="space-y-2">
        {value.map((attr, i) => (
          <div key={i} className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 shrink-0 text-ink-soft" />
            <input
              value={attr.name}
              onChange={(e) => update(i, { name: e.target.value })}
              placeholder="Материал"
              className="input flex-1"
              aria-label={`Название характеристики ${i + 1}`}
            />
            <input
              value={attr.value}
              onChange={(e) => update(i, { value: e.target.value })}
              placeholder="PLA"
              className="input flex-1"
              aria-label={`Значение характеристики ${i + 1}`}
            />
            <button
              type="button"
              aria-label="Удалить характеристику"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="flex h-11 w-10 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-[18px] w-[18px]" />
            </button>
          </div>
        ))}
      </div>

      {value.length === 0 && (
        <p className="mb-2 text-[13px] text-ink-muted">
          Пока нет характеристик. Например: Материал — PLA, Высота — 6 см.
        </p>
      )}

      <button
        type="button"
        onClick={() => onChange([...value, { name: '', value: '' }])}
        className="btn-outline btn-sm mt-3"
      >
        <Plus className="h-4 w-4" /> Добавить характеристику
      </button>
    </div>
  );
}
