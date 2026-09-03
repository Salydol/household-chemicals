'use client';

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ConfirmButton({
  action,
  children,
  confirmLabel = 'Точно удалить?',
  className,
  title,
}: {
  action: () => Promise<void>;
  children: React.ReactNode;
  confirmLabel?: string;
  className?: string;
  title?: string;
}) {
  const [armed, setArmed] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      title={title}
      disabled={pending}
      onClick={() => {
        if (!armed) {
          setArmed(true);
          setTimeout(() => setArmed(false), 4000);
          return;
        }
        startTransition(async () => {
          await action();
          setArmed(false);
        });
      }}
      className={cn(className, armed && 'bg-red-600 text-white hover:bg-red-700')}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : armed ? confirmLabel : children}
    </button>
  );
}
