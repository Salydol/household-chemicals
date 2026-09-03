import type { Metadata } from 'next';
import { getSettings } from '@/lib/settings';
import { PageHeader } from '@/components/admin/PageHeader';
import { SettingsForm } from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Настройки' };

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader title="Настройки" subtitle="Контакты, логотип и WhatsApp для всех кнопок сайта" />
      <SettingsForm initial={settings} />
    </>
  );
}
