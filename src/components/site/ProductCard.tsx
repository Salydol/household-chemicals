import Link from 'next/link';
import type { CardProduct } from '@/lib/types';
import { formatPrice, STATUS_LABEL } from '@/lib/utils';
import { whatsappLink } from '@/lib/whatsapp';
import { ProductImage } from './ProductImage';
import { WhatsAppIcon } from './WhatsAppIcon';

type Props = {
  product: CardProduct;
  showPrices: boolean;
  whatsapp: string;
  whatsappText: string;
};

export function ProductCard({ product, showPrices, whatsapp, whatsappText }: Props) {
  const href = `/product/${product.slug}`;
  const wa = whatsappLink({
    phone: whatsapp,
    baseText: whatsappText,
    productName: product.name,
    productSlug: product.slug,
  });

  const badges: { label: string; className: string }[] = [];
  if (product.isSale) badges.push({ label: 'Акция', className: 'bg-red-500' });
  if (product.isNew) badges.push({ label: 'Новинка', className: 'bg-blue-500' });
  if (product.isFeatured && badges.length === 0) badges.push({ label: 'Хит', className: 'bg-brand-500' });

  return (
    <article className="group card flex flex-col overflow-hidden transition-shadow hover:shadow-pop">
      <div className="relative">
        {badges.length > 0 && (
          <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
            {badges.map((b) => (
              <span key={b.label} className={`badge ${b.className}`}>{b.label}</span>
            ))}
          </div>
        )}
        <Link href={href} aria-label={product.name}>
          <ProductImage
            src={product.images[0]?.imageUrl}
            alt={product.name}
            className="aspect-square p-4"
            imgClassName="transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col border-t border-line p-4">
        {product.category && (
          <span className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
            {product.category.name}
          </span>
        )}

        <h3 className="text-[15px] font-bold leading-snug">
          <Link href={href} className="transition-colors hover:text-brand-600">{product.name}</Link>
        </h3>

        {product.shortDescription && (
          <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-ink-muted">
            {product.shortDescription}
          </p>
        )}

        <div className="mt-3 flex items-baseline gap-2">
          {showPrices && product.price !== null ? (
            <>
              <span className="text-lg font-extrabold text-brand-500">{formatPrice(product.price)}</span>
              {product.oldPrice ? (
                <span className="text-[13px] font-medium text-ink-soft line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              ) : null}
            </>
          ) : (
            <span className="text-[15px] font-bold text-brand-600">Узнать цену</span>
          )}
        </div>

        {(product.price !== null || product.status !== 'IN_STOCK') && (
          <span className="mt-1 text-[12px] font-medium text-ink-muted">
            {STATUS_LABEL[product.status] ?? ''}
          </span>
        )}

        <div className="mt-auto flex items-center gap-2 pt-4">
          <Link href={href} className="btn-outline btn-sm flex-1">Подробнее</Link>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Заказать «${product.name}» в WhatsApp`}
            className="btn-whatsapp btn-sm h-9 w-10 shrink-0 px-0"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
          </a>
        </div>
      </div>
    </article>
  );
}
