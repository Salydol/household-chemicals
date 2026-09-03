import Link from 'next/link';
import { Leaf } from 'lucide-react';

type Props = {
  name: string;
  tagline?: string;
  logo?: string;
  variant?: 'light' | 'dark';
  href?: string;
};

export function Logo({ name, tagline, logo, variant = 'light', href = '/' }: Props) {
  const dark = variant === 'dark';
  return (
    <Link href={href} className="flex items-center gap-2.5">
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt={name} className="h-10 w-10 rounded-lg object-contain" />
      ) : (
        <span
          className={
            dark
              ? 'flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-brand-200'
              : 'flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600'
          }
        >
          <Leaf className="h-[22px] w-[22px]" strokeWidth={2.2} />
        </span>
      )}
      <span className="leading-tight">
        <span className={dark ? 'block text-[17px] font-extrabold text-white' : 'block text-[17px] font-extrabold text-ink'}>
          {name}
        </span>
        {tagline ? (
          <span className={dark ? 'block text-[11px] text-white/60' : 'block text-[11px] text-ink-muted'}>{tagline}</span>
        ) : null}
      </span>
    </Link>
  );
}
