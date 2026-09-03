'use client';

import { useActionState, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2, X } from 'lucide-react';
import { saveCategory, deleteCategory, toggleCategoryActive, moveCategory } from '@/actions/categories';
import type { ActionState } from '@/actions/products';
import { ImageUploader } from './ImageUploader';
import { ActionButton } from './ActionButton';
import { ConfirmButton } from './ConfirmButton';
import { Field, FormMessage, SubmitButton } from './ui';
import { cn } from '@/lib/utils';

export type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  productCount: number;
};

const iconBtn =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-ink-muted transition-colors hover:border-brand-300 hover:text-brand-700 disabled:opacity-40';

export function CategoriesManager({ categories }: { categories: CategoryRow[] }) {
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [creating, setCreating] = useState(false);

  const open = creating || editing !== null;

  return (
    <div className={cn('grid gap-6', open ? 'lg:grid-cols-[1fr_380px]' : 'grid-cols-1')}>
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-[15px] font-bold">Список категорий</h2>
          <button
            type="button"
            onClick={() => { setEditing(null); setCreating(true); }}
            className="btn-primary btn-sm"
          >
            <Plus className="h-4 w-4" /> Добавить
          </button>
        </div>

        {categories.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-ink-muted">Категорий пока нет.</p>
        ) : (
          <ul className="divide-y divide-line">
            {categories.map((c, i) => (
              <li key={c.id} className={cn('flex items-center gap-3 px-4 py-3', !c.isActive && 'opacity-60')}>
                <div className="flex shrink-0 flex-col gap-1">
                  <ActionButton action={async () => { await moveCategory(c.id, 'up'); }} title="Выше"
                    className="inline-flex h-5 w-6 items-center justify-center rounded text-ink-soft hover:bg-surface hover:text-ink">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </ActionButton>
                  <ActionButton action={async () => { await moveCategory(c.id, 'down'); }} title="Ниже"
                    className="inline-flex h-5 w-6 items-center justify-center rounded text-ink-soft hover:bg-surface hover:text-ink">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </ActionButton>
                </div>

                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
                  {c.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.imageUrl} alt="" className="h-full w-full object-contain p-1" />
                  ) : (
                    <div className="h-full w-full bg-surface" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-semibold">{c.name}</div>
                  <div className="mt-0.5 text-[12px] text-ink-soft">
                    /{c.slug} · товаров: {c.productCount}{!c.isActive && ' · скрыта'}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button type="button" title="Изменить" onClick={() => { setCreating(false); setEditing(c); }} className={iconBtn}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <ActionButton action={async () => { await toggleCategoryActive(c.id); }}
                    title={c.isActive ? 'Скрыть' : 'Показать'} className={iconBtn}>
                    {c.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </ActionButton>
                  <ConfirmButton action={async () => { await deleteCategory(c.id); }} title="Удалить"
                    confirmLabel="Точно?"
                    className={`${iconBtn} w-auto px-2 text-[11px] font-bold hover:border-red-300 hover:text-red-600`}>
                    <Trash2 className="h-4 w-4" />
                  </ConfirmButton>
                </div>
                <span className="sr-only">{i}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {open && (
        <CategoryForm
          key={editing?.id ?? 'new'}
          category={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
        />
      )}
    </div>
  );
}

function CategoryForm({ category, onClose }: { category: CategoryRow | null; onClose: () => void }) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveCategory, {});
  const [image, setImage] = useState<string[]>(category?.imageUrl ? [category.imageUrl] : []);

  useEffect(() => {
    if (state.ok && !category) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ok]);

  return (
    <form action={formAction} className="card h-fit space-y-4 p-5 lg:sticky lg:top-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold">{category ? 'Редактирование' : 'Новая категория'}</h2>
        <button type="button" aria-label="Закрыть" onClick={onClose} className="text-ink-muted hover:text-ink">
          <X className="h-5 w-5" />
        </button>
      </div>

      {category && <input type="hidden" name="id" value={category.id} />}
      <input type="hidden" name="imageUrl" value={image[0] ?? ''} />
      <input type="hidden" name="sortOrder" value={0} />

      <FormMessage state={state} />

      <Field label="Название">
        <input name="name" defaultValue={category?.name ?? ''} required minLength={2} placeholder="Динозавры" className="input" />
      </Field>

      <Field label="Ссылка (slug)" hint="Оставьте пустым — сформируется автоматически">
        <input name="slug" defaultValue={category?.slug ?? ''} placeholder="dinozavry" className="input" />
      </Field>

      <Field label="Описание">
        <textarea name="description" defaultValue={category?.description ?? ''} rows={3} className="textarea" />
      </Field>

      <ImageUploader value={image} onChange={setImage} multiple={false} label="Изображение категории" />

      <label className="flex cursor-pointer items-center gap-2.5 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={category?.isActive ?? true}
          className="h-[18px] w-[18px] rounded border-line text-brand-600 focus:ring-brand-400" />
        <span className="font-semibold">Показывать на сайте</span>
      </label>

      <div className="flex gap-2 pt-1">
        <SubmitButton>{category ? 'Сохранить' : 'Добавить'}</SubmitButton>
        <button type="button" onClick={onClose} className="btn-outline btn-md">Отмена</button>
      </div>
    </form>
  );
}
