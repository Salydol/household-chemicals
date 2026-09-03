'use client';

import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';

export function ActionButton({
  action,
  children,
  className,
  title,
}: {
  action: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      title={title}
      disabled={pending}
      className={className}
      onClick={() => startTransition(async () => { await action(); })}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  );
}
