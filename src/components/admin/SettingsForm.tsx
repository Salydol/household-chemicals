'use client';

import { useActionState, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { saveSettings } from '@/actions/settings';
import type { ActionState } from '@/actions/products';
import type { SiteSettings } from '@/lib/settings';
import { normalizeWhatsApp } from '@/lib/whatsapp';
import { ImageUploader } from './ImageUploader';
import { Field, FormMessage, SubmitButton } from './ui';

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveSettings, {});
  const [logo, setLogo] = useState<string[]>(initial.logo ? [initial.logo] : []);
  const [whatsapp, setWhatsapp] = useState(initial.whatsapp);

  const normalized = normalizeWhatsApp(whatsapp);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="logo" value={logo[0] ?? ''} />

      <div className="card space-y-4 p-5">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-[18px] w-[18px] text-whatsapp" />
          <h2 className="text-[15px] font-bold">WhatsApp</h2>
        </div>
        <p className="rounded-lg bg-brand-50 px-3.5 py-2.5 text-[12px] leading-relaxed text-brand-800">
          Все кнопки «Заказать» и «Написать в WhatsApp» на сайте используют этот номер.
          Достаточно поменять его один раз здесь.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Номер WhatsApp" hint={normalized ? `Ссылка: https://wa.me/${normalized}` : 'Введите номер в любом формате'}>
            <input
              name="whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+7 700 123 45 67"
              className="input"
            />
          </Field>

          <Field label="Текст сообщения" hint="К нему автоматически добавляется название товара и ссылка">
            <input
              name="whatsapp_text"
              defaultValue={initial.whatsapp_text}
              placeholder="Здравствуйте! Хочу узнать подробнее о товаре"
              className="input"
            />
          </Field>
        </div>
      </div>

      <div className="card space-y-4 p-5">
        <h2 className="text-[15px] font-bold">Компания</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Название компании">
            <input name="company_name" defaultValue={initial.company_name} className="input" />
          </Field>
          <Field label="Подпись под названием">
            <input name="company_tagline" defaultValue={initial.company_tagline} className="input" />
          </Field>
        </div>

        <ImageUploader value={logo} onChange={setLogo} multiple={false} label="Логотип" hint="Квадратный PNG или SVG" />
      </div>

      <div className="card space-y-4 p-5">
        <h2 className="text-[15px] font-bold">Контакты</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Телефон">
            <input name="phone" defaultValue={initial.phone} className="input" />
          </Field>
          <Field label="Email">
            <input name="email" defaultValue={initial.email} className="input" />
          </Field>
          <Field label="Instagram" hint="Полная ссылка">
            <input name="instagram" defaultValue={initial.instagram} placeholder="https://instagram.com/..." className="input" />
          </Field>
          <Field label="Telegram" hint="Полная ссылка">
            <input name="telegram" defaultValue={initial.telegram} placeholder="https://t.me/..." className="input" />
          </Field>
          <Field label="Адрес">
            <input name="address" defaultValue={initial.address} className="input" />
          </Field>
          <Field label="Режим работы">
            <input name="work_hours" defaultValue={initial.work_hours} className="input" />
          </Field>
        </div>
      </div>

      <div className="card space-y-4 p-5">
        <h2 className="text-[15px] font-bold">Отображение цен</h2>
        <Field
          label="Цены на сайте"
          hint="Если выключить — вместо цены посетитель увидит «Узнать цену» и перейдёт в WhatsApp"
        >
          <select name="show_prices" defaultValue={initial.show_prices} className="input sm:w-80">
            <option value="1">Показывать цены</option>
            <option value="0">Не показывать (только через WhatsApp)</option>
          </select>
        </Field>
      </div>

      <div className="card space-y-4 p-5">
        <h2 className="text-[15px] font-bold">Страница «О компании»</h2>
        <Field label="Заголовок">
          <input name="about_page_title" defaultValue={initial.about_page_title} className="input" />
        </Field>
        <Field label="Текст">
          <textarea name="about_page_text" defaultValue={initial.about_page_text} rows={8} className="textarea" />
        </Field>
      </div>

      <div className="card sticky bottom-4 flex items-center gap-3 p-4">
        <SubmitButton>Сохранить настройки</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
