'use client';

import Link from 'next/link';
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import { deleteProduct, toggleProductActive } from '@/actions/products';
import { ActionButton } from './ActionButton';
import { ConfirmButton } from './ConfirmButton';

const cell =
  'inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-lg border border-line bg-white px-2 text-[12px] font-semibold text-ink-muted transition-colors hover:border-brand-300 hover:text-brand-700';

export function ProductRowActions({
  id,
  slug,
  isActive,
}: {
  id: number;
  slug: string;
  isActive: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <Link href={`/product/${slug}`} target="_blank" title="Посмотреть на сайте" className={cell}>
        <Eye className="h-4 w-4" />
      </Link>
      <Link href={`/admin/products/${id}`} title="Изменить" className={cell}>
        <Pencil className="h-4 w-4" />
      </Link>
      <ActionButton
        action={async () => { await toggleProductActive(id); }}
        title={isActive ? 'Скрыть с сайта' : 'Опубликовать'}
        className={cell}
      >
        {isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </ActionButton>
      <ConfirmButton
        action={async () => { await deleteProduct(id); }}
        title="Удалить"
        className={`${cell} hover:border-red-300 hover:text-red-600`}
      >
        <Trash2 className="h-4 w-4" />
      </ConfirmButton>
    </div>
  );
}
