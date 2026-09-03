'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff, X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);

  const has = images.length > 0;
  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoom(false);
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, images.length]);

  if (!has) {
    return (
      <div className="card flex aspect-square items-center justify-center text-ink-soft">
        <ImageOff className="h-10 w-10" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div>
      <div className="card relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[index]} alt={alt} className="aspect-square w-full object-contain p-6" />

        <button
          type="button"
          onClick={() => setZoom(true)}
          aria-label="Увеличить фото"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white/90 text-ink-muted backdrop-blur transition-colors hover:text-brand-600"
        >
          <ZoomIn className="h-5 w-5" />
        </button>

        {images.length > 1 && (
          <>
            <button type="button" onClick={prev} aria-label="Предыдущее фото"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/90 backdrop-blur transition-colors hover:text-brand-600">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={next} aria-label="Следующее фото"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/90 backdrop-blur transition-colors hover:text-brand-600">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Фото ${i + 1}`}
              className={cn(
                'overflow-hidden rounded-lg border bg-white p-1.5 transition-colors',
                i === index ? 'border-brand-500 ring-1 ring-brand-200' : 'border-line hover:border-brand-300',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="aspect-square w-full object-contain" />
            </button>
          ))}
        </div>
      )}

      {zoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={() => setZoom(false)}>
          <button type="button" aria-label="Закрыть" onClick={() => setZoom(false)}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20">
            <X className="h-6 w-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[index]} alt={alt} onClick={(e) => e.stopPropagation()} className="max-h-[88vh] max-w-[92vw] object-contain" />
          {images.length > 1 && (
            <>
              <button type="button" aria-label="Предыдущее" onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button type="button" aria-label="Следующее" onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
