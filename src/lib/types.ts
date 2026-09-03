export type CardProduct = {
  id: number;
  name: string;
  slug: string;
  shortDescription: string | null;
  price: number | null;
  oldPrice: number | null;
  status: string;
  isNew: boolean;
  isSale: boolean;
  isFeatured: boolean;
  category: { name: string; slug: string } | null;
  images: { imageUrl: string }[];
};
