import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center">
        <div className="container-site py-20 text-center">
          <div className="text-[96px] font-extrabold leading-none tracking-tight text-brand-100 sm:text-[140px]">404</div>
          <h1 className="-mt-4 text-2xl font-bold sm:text-3xl">Страница не найдена</h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-muted">
            Возможно, товар был скрыт или ссылка устарела. Загляните в каталог — там вся актуальная продукция.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn-outline btn-lg"><ArrowLeft className="h-4 w-4" /> На главную</Link>
            <Link href="/catalog" className="btn-primary btn-lg"><Search className="h-4 w-4" /> В каталог</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
