import type { Metadata } from 'next';
import { Clock, Instagram, Mail, MapPin, Phone, Send } from 'lucide-react';
import { getSettings } from '@/lib/settings';
import { whatsappLink } from '@/lib/whatsapp';
import { Breadcrumbs } from '@/components/site/Breadcrumbs';
import { WhatsAppIcon } from '@/components/site/WhatsAppIcon';
import { CtaBanner } from '@/components/site/CtaBanner';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Контакты' };

export default async function ContactsPage() {
  const s = await getSettings();
  const wa = whatsappLink({ phone: s.whatsapp, baseText: s.whatsapp_text });

  const items = [
    s.phone && { icon: Phone, label: 'Телефон', value: s.phone, href: `tel:${s.phone.replace(/\s/g, '')}` },
    s.email && { icon: Mail, label: 'Email', value: s.email, href: `mailto:${s.email}` },
    s.address && { icon: MapPin, label: 'Адрес', value: s.address },
    s.work_hours && { icon: Clock, label: 'Режим работы', value: s.work_hours },
    s.instagram && { icon: Instagram, label: 'Instagram', value: 'Наш профиль', href: s.instagram },
    s.telegram && { icon: Send, label: 'Telegram', value: 'Написать', href: s.telegram },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href?: string }[];

  return (
    <>
      <div className="container-site pb-12 pt-6">
        <Breadcrumbs items={[{ href: '/', label: 'Главная' }, { label: 'Контакты' }]} />

        <h1 className="mt-4 text-[32px] font-extrabold tracking-tight sm:text-[40px]">Контакты</h1>
        <p className="mt-2 max-w-xl text-[15px] text-ink-muted">
          Быстрее всего ответим в WhatsApp — там же поможем с выбором и оформим заказ.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[12px] uppercase tracking-wide text-ink-soft">{item.label}</span>
                    <span className="mt-1 block text-[15px] font-bold">{item.value}</span>
                  </span>
                </>
              );
              return item.href ? (
                <a key={item.label} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined}
                   rel="noopener noreferrer"
                   className="card flex items-center gap-3.5 p-5 transition-colors hover:border-brand-300">
                  {content}
                </a>
              ) : (
                <div key={item.label} className="card flex items-center gap-3.5 p-5">{content}</div>
              );
            })}
          </div>

          <div className="rounded-2xl bg-brand-800 p-7 text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <WhatsAppIcon className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-xl font-bold">Напишите нам в WhatsApp</h2>
            <p className="mt-2.5 text-sm leading-relaxed text-white/70">
              Отвечаем в рабочее время. Расскажите, что вас интересует — подберём и рассчитаем стоимость.
            </p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-lg mt-6 w-full">
              <WhatsAppIcon /> Написать в WhatsApp
            </a>
          </div>
        </div>
      </div>

      <CtaBanner
        title={`${s.company_name} — всегда на связи`}
        text="Задайте вопрос в WhatsApp: подскажем по наличию, срокам и доставке."
        whatsapp={s.whatsapp}
        whatsappText={s.whatsapp_text}
      />
    </>
  );
}
