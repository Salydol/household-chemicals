'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, Package, FolderTree, Home, Settings, LogOut, ExternalLink, Menu, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Товары', icon: Package },
  { href: '/admin/categories', label: 'Категории', icon: FolderTree },
  { href: '/admin/homepage', label: 'Главная страница', icon: Home },
  { href: '/admin/settings', label: 'Настройки', icon: Settings },
];

export function Sidebar({ companyName, userName }: { companyName: string; userName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {ITEMS.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
              active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white',
            )}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const body = (
    <div className="flex h-full flex-col bg-brand-900 p-4 text-white">
      <div className="mb-6 px-2 pt-2">
        <span className="block text-[15px] font-extrabold">{companyName}</span>
        <span className="block text-[11px] text-white/50">Админ-панель</span>
      </div>

      {nav}

      <div className="mt-4 space-y-1 border-t border-white/10 pt-4">
        <Link href="/" target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white">
          <ExternalLink className="h-[18px] w-[18px]" strokeWidth={1.9} /> Открыть сайт
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.9} /> Выйти
        </button>
        <div className="px-3 pt-2 text-[11px] text-white/40">{userName}</div>
      </div>
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white px-4 lg:hidden">
        <span className="text-sm font-bold">{companyName} — админка</span>
        <button type="button" aria-label="Меню" onClick={() => setOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <aside className="hidden w-[248px] shrink-0 bg-brand-900 lg:block">
        <div className="sticky top-0 h-screen">{body}</div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[270px]">
            <button type="button" aria-label="Закрыть" onClick={() => setOpen(false)}
              className="absolute -right-12 top-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white">
              <X className="h-5 w-5" />
            </button>
            {body}
          </div>
        </div>
      )}
    </>
  );
}
