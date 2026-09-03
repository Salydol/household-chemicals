import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import { auth } from '@/lib/auth';
import { getSettings } from '@/lib/settings';
import { LoginForm } from '@/components/admin/LoginForm';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Вход в админ-панель' };

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect('/admin');

  const s = await getSettings();

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="card p-7">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Lock className="h-6 w-6" strokeWidth={1.8} />
          </span>
          <h1 className="mt-5 text-xl font-bold">Вход в админ-панель</h1>
          <p className="mt-1.5 text-[13px] text-ink-muted">{s.company_name}</p>

          <div className="mt-6">
            <LoginForm />
          </div>
        </div>

        <Link href="/" className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-muted hover:text-brand-600">
          <ArrowLeft className="h-4 w-4" /> Вернуться на сайт
        </Link>
      </div>
    </div>
  );
}
