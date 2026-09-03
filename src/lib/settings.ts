import { prisma } from '@/lib/prisma';

export type SiteSettings = {
  company_name: string;
  company_tagline: string;
  logo: string;
  phone: string;
  whatsapp: string;
  whatsapp_text: string;
  instagram: string;
  telegram: string;
  email: string;
  address: string;
  work_hours: string;
  show_prices: string; // '1' | '0'
  about_page_title: string;
  about_page_text: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  company_name: 'Название компании',
  company_tagline: 'Каталог продукции',
  logo: '',
  phone: '+7 700 123 45 67',
  whatsapp: '77001234567',
  whatsapp_text: 'Здравствуйте! Хочу узнать подробнее о товаре',
  instagram: '',
  telegram: '',
  email: 'info@site.kz',
  address: 'Казахстан',
  work_hours: 'Пн–Сб, 9:00–18:00',
  show_prices: '1',
  about_page_title: 'О компании',
  about_page_text: '',
};

export const SETTING_KEYS = Object.keys(DEFAULT_SETTINGS) as (keyof SiteSettings)[];

export async function getSettings(): Promise<SiteSettings> {
  try {
    const rows = await prisma.siteSetting.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...DEFAULT_SETTINGS, ...map } as SiteSettings;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function pricesVisible(settings: SiteSettings) {
  return settings.show_prices !== '0';
}
