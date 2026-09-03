import Link from 'next/link';
import { getSettings } from '@/lib/settings';
import { whatsappLink } from '@/lib/whatsapp';
import { Logo } from './Logo';
import { NavLinks } from './NavLinks';
import { MobileMenu } from './MobileMenu';
import { WhatsAppIcon } from './WhatsAppIcon';

export async function Header() {
  const s = await getSettings();
  const wa = whatsappLink({ phone: s.whatsapp, baseText: s.whatsapp_text });

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-site flex h-[72px] items-center justify-between gap-6">
        <Logo name={s.company_name} tagline={s.company_tagline} logo={s.logo || undefined} />

        <NavLinks className="hidden lg:flex" />

        <div className="flex items-center gap-3">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2.5 md:flex"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <WhatsAppIcon />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-bold text-ink">{s.phone}</span>
              <span className="block text-[11px] text-ink-muted">Написать в WhatsApp</span>
            </span>
          </a>

          <Link href="/catalog" className="btn-primary btn-sm hidden sm:inline-flex lg:hidden">
            Каталог
          </Link>

          <MobileMenu phone={s.phone} whatsappHref={wa} />
        </div>
      </div>
    </header>
  );
}
