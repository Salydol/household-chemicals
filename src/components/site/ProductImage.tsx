import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProductImage({
  src,
  alt,
  className,
  imgClassName,
  eager = false,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  if (!src) {
    return (
      <div className={cn('flex items-center justify-center bg-surface text-ink-soft', className)}>
        <ImageOff className="h-8 w-8" strokeWidth={1.5} />
      </div>
    );
  }
  return (
    <div className={cn('overflow-hidden bg-white', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} className={cn('h-full w-full object-contain', imgClassName)} />
    </div>
  );
}
