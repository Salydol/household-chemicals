'use client';

import { useActionState, useState } from 'react';
import { saveHomeContent } from '@/actions/homepage';
import type { ActionState } from '@/actions/products';
import { ImageUploader } from './ImageUploader';
import { AdvantagesEditor, type AdvantageItem } from './AdvantagesEditor';
import { Field, FormMessage, SubmitButton } from './ui';

export type HomeValues = {
  heroTitle: string; heroAccent: string; heroSubtitle: string; heroText: string;
  heroImage: string; heroButtonText: string;
  aboutTitle: string; aboutText: string; aboutImage: string;
  aboutStat1Value: string; aboutStat1Label: string;
  aboutStat2Value: string; aboutStat2Label: string;
  aboutStat3Value: string; aboutStat3Label: string;
  ctaTitle: string; ctaText: string;
};

export function HomeContentForm({
  initial,
  advantages,
}: {
  initial: HomeValues;
  advantages: AdvantageItem[];
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveHomeContent, {});
  const [heroImage, setHeroImage] = useState<string[]>(initial.heroImage ? [initial.heroImage] : []);
  const [aboutImage, setAboutImage] = useState<string[]>(initial.aboutImage ? [initial.aboutImage] : []);
  const [items, setItems] = useState<AdvantageItem[]>(advantages);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="heroImage" value={heroImage[0] ?? ''} />
      <input type="hidden" name="aboutImage" value={aboutImage[0] ?? ''} />
      <input
        type="hidden"
        name="advantagesJson"
        value={JSON.stringify(items.filter((a) => a.title.trim()))}
      />

      <div className="card space-y-4 p-5">
        <h2 className="text-[15px] font-bold">Первый экран (Hero)</h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Заголовок, строка 1">
            <input name="heroTitle" defaultValue={initial.heroTitle} className="input" />
          </Field>
          <Field label="Строка 2 (зелёная)">
            <input name="heroAccent" defaultValue={initial.heroAccent} className="input" />
          </Field>
          <Field label="Строка 3">
            <input name="heroSubtitle" defaultValue={initial.heroSubtitle} className="input" />
          </Field>
        </div>

        <Field label="Текст под заголовком">
          <textarea name="heroText" defaultValue={initial.heroText} rows={3} className="textarea" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Текст кнопки">
            <input name="heroButtonText" defaultValue={initial.heroButtonText} className="input" placeholder="Смотреть каталог" />
          </Field>
        </div>

        <ImageUploader value={heroImage} onChange={setHeroImage} multiple={false} label="Изображение первого экрана" />
      </div>

      <div className="card space-y-4 p-5">
        <h2 className="text-[15px] font-bold">Блок «О компании»</h2>

        <Field label="Заголовок">
          <input name="aboutTitle" defaultValue={initial.aboutTitle} className="input" />
        </Field>
        <Field label="Описание">
          <textarea name="aboutText" defaultValue={initial.aboutText} rows={5} className="textarea" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-lg border border-line p-3.5">
              <span className="label">Показатель {n}</span>
              <input
                name={`aboutStat${n}Value`}
                defaultValue={initial[`aboutStat${n}Value` as keyof HomeValues]}
                placeholder="5+ лет"
                className="input"
              />
              <input
                name={`aboutStat${n}Label`}
                defaultValue={initial[`aboutStat${n}Label` as keyof HomeValues]}
                placeholder="на рынке"
                className="input mt-2"
              />
            </div>
          ))}
        </div>

        <ImageUploader value={aboutImage} onChange={setAboutImage} multiple={false} label="Фото для блока «О компании»" />
      </div>

      <div className="card space-y-4 p-5">
        <h2 className="text-[15px] font-bold">Преимущества</h2>
        <AdvantagesEditor value={items} onChange={setItems} />
      </div>

      <div className="card space-y-4 p-5">
        <h2 className="text-[15px] font-bold">Финальный блок</h2>
        <Field label="Заголовок">
          <input name="ctaTitle" defaultValue={initial.ctaTitle} className="input" placeholder="Не нашли подходящий товар?" />
        </Field>
        <Field label="Текст">
          <input name="ctaText" defaultValue={initial.ctaText} className="input" placeholder="Напишите нам в WhatsApp" />
        </Field>
      </div>

      <div className="card sticky bottom-4 flex items-center gap-3 p-4">
        <SubmitButton>Сохранить главную</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
