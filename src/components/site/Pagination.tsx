import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  page: number;
  totalPages: number;
  makeHref: (page: number) => string;
};

export function Pagination({ page, totalPages, makeHref }: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | '…')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== '…') pages.push('…');
  }

  const cell = 'inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-line bg-white px-3 text-sm font-semibold transition-colors';

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Пагинация">
      {page > 1 ? (
        <Link href={makeHref(page - 1)} aria-label="Назад" className={cn(cell, 'hover:border-brand-300 hover:text-brand-700')}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className={cn(cell, 'cursor-not-allowed text-ink-soft opacity-60')}><ChevronLeft className="h-4 w-4" /></span>
      )}

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="px-1 text-ink-soft">…</span>
        ) : (
          <Link
            key={p}
            href={makeHref(p)}
            className={cn(cell, p === page ? 'border-brand-700 bg-brand-700 text-white' : 'hover:border-brand-300 hover:text-brand-700')}
          >
            {p}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={makeHref(page + 1)} aria-label="Вперёд" className={cn(cell, 'hover:border-brand-300 hover:text-brand-700')}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={cn(cell, 'cursor-not-allowed text-ink-soft opacity-60')}><ChevronRight className="h-4 w-4" /></span>
      )}
    </nav>
  );
}
