import Link from 'next/link';
import { ProductImage } from './ProductImage';

type Props = {
  category: { name: string; slug: string; imageUrl: string | null };
};

export function CategoryCard({ category }: Props) {
  return (
    <Link
      href={`/catalog?category=${category.slug}`}
      className="group card flex flex-col items-center overflow-hidden p-3 text-center transition-all hover:border-brand-300 hover:shadow-pop"
    >
      <ProductImage
        src={category.imageUrl}
        alt={category.name}
        className="aspect-square w-full rounded-lg bg-surface p-3"
        imgClassName="transition-transform duration-300 group-hover:scale-105"
      />
      <span className="mt-3 pb-1 text-[13px] font-semibold leading-snug text-ink transition-colors group-hover:text-brand-600">
        {category.name}
      </span>
    </Link>
  );
}
