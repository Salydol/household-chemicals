'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { NAV_ITEMS } from './NavLinks';
import { cn } from '@/lib/utils';

export function MobileMenu({ phone, whatsappHref }: { phone: string; whatsappHref: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Меню"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white p-5 shadow-pop">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-bold text-ink-muted">Меню</span>
              <button
                type="button"
                aria-label="Закрыть"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col">
              {NAV_ITEMS.map((item) => {
                const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'border-b border-line py-3.5 text-[15px] font-semibold',
                      active ? 'text-brand-600' : 'text-ink',
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-3 pt-6">
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="btn-outline btn-md w-full">
                <Phone className="h-4 w-4" /> {phone}
              </a>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-md w-full">
                Написать в WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
