'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Star, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  label?: string;
  hint?: string;
};

export function ImageUploader({ value, onChange, multiple = true, label = 'Фотографии', hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      Array.from(files).forEach((f) => form.append('files', f));
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки');
      onChange(multiple ? [...value, ...data.urls] : [data.urls[0]]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить файл');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="label mb-0">{label}</span>
        {hint && <span className="text-[12px] text-ink-muted">{hint}</span>}
      </div>

      <div className={cn('grid gap-3', multiple ? 'grid-cols-3 sm:grid-cols-4' : 'max-w-[300px] grid-cols-2')}>
        {value.map((url, i) => (
          <div key={url + i} className="group relative overflow-hidden rounded-lg border border-line bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="aspect-square w-full object-contain p-2" />

            {multiple && i === 0 && (
              <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                <Star className="h-3 w-3" /> Главное
              </span>
            )}

            <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-white/95 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
              {multiple && (
                <>
                  <button type="button" aria-label="Влево" onClick={() => move(i, i - 1)}
                    className="rounded p-1 text-ink-muted hover:bg-surface hover:text-ink">
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button type="button" aria-label="Вправо" onClick={() => move(i, i + 1)}
                    className="rounded p-1 text-ink-muted hover:bg-surface hover:text-ink">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              )}
              <button type="button" aria-label="Удалить" onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="rounded p-1 text-red-500 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {(multiple || value.length === 0) && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-line bg-white text-ink-muted transition-colors hover:border-brand-300 hover:text-brand-600"
          >
            {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" strokeWidth={1.6} />}
            <span className="text-[11px] font-semibold">Загрузить</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => upload(e.target.files)}
      />

      {error && <p className="mt-2 text-[12px] font-medium text-red-600">{error}</p>}
    </div>
  );
}
