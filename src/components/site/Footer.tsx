import Link from 'next/link';
import { Instagram, Send, Mail, MapPin } from 'lucide-react';
import { getSettings } from '@/lib/settings';
import { whatsappLink } from '@/lib/whatsapp';
import { prisma } from '@/lib/prisma';
import { Logo } from './Logo';
import { WhatsAppIcon } from './WhatsAppIcon';

export async function Footer() {
  const s = await getSettings();
  const wa = whatsappLink({ phone: s.whatsapp, baseText: s.whatsapp_text });

  let categories: { name: string; slug: string }[] = [];
  try {
    categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      take: 5,
      select: { name: true, slug: true },
    });
  } catch {
    categories = [];
  }

  return (
    <footer className="mt-20 bg-brand-800 text-white/80">
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo name={s.company_name} tagline={s.company_tagline} logo={s.logo || undefined} variant="dark" />
          <p className="mt-4 line-clamp-4 max-w-xs text-sm leading-relaxed text-white/60">
            {s.about_page_text ? s.about_page_text.split('\n')[0] : s.company_tagline}
          </p>
          <div className="mt-5 flex gap-2">
            {s.instagram && (
              <a href={s.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                 className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20">
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {s.telegram && (
              <a href={s.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram"
                 className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20">
                <Send className="h-5 w-5" />
              </a>
            )}
            <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
               className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20">
              <WhatsAppIcon />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-[15px] font-bold text-white">Навигация</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/" className="transition-colors hover:text-white">Главная</Link></li>
            <li><Link href="/catalog" className="transition-colors hover:text-white">Каталог</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-white">О компании</Link></li>
            <li><Link href="/contacts" className="transition-colors hover:text-white">Контакты</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[15px] font-bold text-white">Категории</h3>
          <ul className="space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/catalog?category=${c.slug}`} className="transition-colors hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
            {categories.length === 0 && <li className="text-white/50">Скоро появятся</li>}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[15px] font-bold text-white">Контакты</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 text-brand-300"><WhatsAppIcon className="h-4 w-4" /></span>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                <span className="block font-bold text-white">{s.phone}</span>
                <span className="block text-white/60">Написать в WhatsApp</span>
              </a>
            </li>
            {s.email && (
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 text-brand-300" />
                <a href={`mailto:${s.email}`} className="transition-colors hover:text-white">{s.email}</a>
              </li>
            )}
            {s.address && (
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                <span>{s.address}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-5 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {s.company_name}. Все права защищены.</span>
          <span>{s.work_hours}</span>
        </div>
      </div>
    </footer>
  );
}
