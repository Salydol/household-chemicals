'use client';

import { useEffect } from 'react';
import { RefreshCw, TriangleAlert } from 'lucide-react';

export default function AdminError({
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
    <div className="card p-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
        <TriangleAlert className="h-6 w-6" strokeWidth={1.8} />
      </span>
      <h1 className="mt-5 text-lg font-bold">Ошибка при загрузке раздела</h1>
      <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-ink-muted">
        Чаще всего причина — недоступная база данных. Проверьте, запущен ли PostgreSQL
        и верна ли строка подключения в <code className="rounded bg-surface px-1">.env</code>.
      </p>
      <button type="button" onClick={reset} className="btn-primary btn-md mt-6">
        <RefreshCw className="h-4 w-4" /> Повторить
      </button>
    </div>
  );
}
