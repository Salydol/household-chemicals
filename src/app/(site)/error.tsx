'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, TriangleAlert } from 'lucide-react';

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-site py-24 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
        <TriangleAlert className="h-7 w-7" strokeWidth={1.8} />
      </span>
      <h1 className="mt-6 text-2xl font-bold">Что-то пошло не так</h1>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-muted">
        Страница временно недоступна. Попробуйте обновить — или напишите нам, мы поможем.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="btn-primary btn-lg">
          <RefreshCw className="h-4 w-4" /> Обновить
        </button>
        <Link href="/" className="btn-outline btn-lg">На главную</Link>
      </div>
    </div>
  );
}
