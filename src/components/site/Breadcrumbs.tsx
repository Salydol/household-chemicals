import Link from 'next/link';

type Crumb = { href?: string; label: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Навигация" className="flex flex-wrap items-center gap-2 text-[13px] text-ink-muted">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-brand-600">{item.label}</Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
          {i < items.length - 1 && <span className="text-ink-soft">/</span>}
        </span>
      ))}
    </nav>
  );
}
