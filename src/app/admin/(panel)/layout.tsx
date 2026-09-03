import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getSettings } from '@/lib/settings';
import { Sidebar } from '@/components/admin/Sidebar';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  const s = await getSettings();

  return (
    <div className="min-h-screen bg-surface lg:flex">
      <Sidebar
        companyName={s.company_name}
        userName={session.user.email ?? session.user.name ?? 'Администратор'}
      />
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1200px] p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
