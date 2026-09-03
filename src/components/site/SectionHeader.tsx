import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function SectionHeader({
  title,
  linkHref,
  linkLabel,
}: {
  title: string;
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="section-title">{title}</h2>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-ink-muted transition-colors hover:text-brand-600 sm:inline-flex"
        >
          {linkLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
