/** Оставляет только цифры: "+7 (700) 123-45-67" -> "77001234567" */
export function normalizeWhatsApp(raw: string) {
  return (raw || '').replace(/\D/g, '');
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

type Options = {
  phone: string;
  /** Базовый текст из настроек */
  baseText?: string;
  productName?: string;
  productSlug?: string;
  custom?: string;
};

/**
 * Собирает ссылку wa.me с автоматическим сообщением.
 * Пример: Здравствуйте! Хочу узнать подробнее о товаре «Динозавр T-Rex»: https://site.kz/product/dinosaur-trex
 */
export function whatsappLink({ phone, baseText, productName, productSlug, custom }: Options) {
  const number = normalizeWhatsApp(phone);
  let text = custom ?? '';

  if (!text) {
    const base = baseText?.trim() || 'Здравствуйте! Хочу узнать подробнее о товаре';
    if (productName) {
      text = `${base} «${productName}»`;
      if (productSlug) text += `: ${siteUrl()}/product/${productSlug}`;
      else text += '.';
    } else {
      text = 'Здравствуйте! У меня вопрос по вашей продукции.';
    }
  }

  const base = number ? `https://wa.me/${number}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(text)}`;
}
