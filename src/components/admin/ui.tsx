'use client';

import { useFormStatus } from 'react-dom';
import { Check, Loader2, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SubmitButton({
  children = 'Сохранить',
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn('btn-primary btn-md', className)}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function FormMessage({ state }: { state: { ok?: boolean; error?: string; message?: string } }) {
  if (state.error) {
    return (
      <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700">
        <TriangleAlert className="h-4 w-4 shrink-0" /> {state.error}
      </p>
    );
  }
  if (state.ok) {
    return (
      <p className="flex items-center gap-2 rounded-lg bg-brand-50 px-3.5 py-2.5 text-[13px] font-medium text-brand-700">
        <Check className="h-4 w-4 shrink-0" /> {state.message ?? 'Сохранено'}
      </p>
    );
  }
  return null;
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[12px] text-ink-muted">{hint}</span>}
    </label>
  );
}

export function Toggle({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-white p-3.5">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer rounded border-line text-brand-600 focus:ring-brand-400"
      />
      <span className="leading-tight">
        <span className="block text-[13px] font-semibold">{label}</span>
        {hint && <span className="mt-0.5 block text-[12px] text-ink-muted">{hint}</span>}
      </span>
    </label>
  );
}
