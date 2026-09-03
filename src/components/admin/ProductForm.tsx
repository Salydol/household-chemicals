'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { saveProduct, type ActionState } from '@/actions/products';
import { ImageUploader } from './ImageUploader';
import { AttributesEditor, type Attribute } from './AttributesEditor';
import { Field, FormMessage, SubmitButton, Toggle } from './ui';

type Category = { id: number; name: string };

export type ProductFormValues = {
  id?: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: string;
  oldPrice: string;
  categoryId: string;
  status: string;
  keywords: string;
  sortOrder: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isSale: boolean;
  showOnHome: boolean;
  images: string[];
  attributes: Attribute[];
};

export const EMPTY_PRODUCT: ProductFormValues = {
  name: '', slug: '', shortDescription: '', description: '',
  price: '', oldPrice: '', categoryId: '', status: 'IN_STOCK',
  keywords: '', sortOrder: '0',
  isActive: true, isFeatured: false, isNew: false, isSale: false, showOnHome: false,
  images: [], attributes: [],
};

export function ProductForm({
  initial,
  categories,
  showPrices,
}: {
  initial: ProductFormValues;
  categories: Category[];
  showPrices: boolean;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveProduct, {});
  const [images, setImages] = useState<string[]>(initial.images);
  const [attributes, setAttributes] = useState<Attribute[]>(initial.attributes);

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="imagesJson" value={JSON.stringify(images.map((imageUrl) => ({ imageUrl })))} />
      <input
        type="hidden"
        name="attributesJson"
        value={JSON.stringify(attributes.filter((a) => a.name.trim() && a.value.trim()))}
      />

      {/* ---------- Основное ---------- */}
      <div className="space-y-6">
        <div className="card space-y-4 p-5">
          <h2 className="text-[15px] font-bold">Основное</h2>

          <Field label="Название">
            <input name="name" defaultValue={initial.name} required minLength={2} placeholder="Динозавр T-Rex" className="input" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Категория">
              <select name="categoryId" defaultValue={initial.categoryId} className="input">
                <option value="">— без категории —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Наличие">
              <select name="status" defaultValue={initial.status} className="input">
                <option value="IN_STOCK">В наличии</option>
                <option value="ON_ORDER">Под заказ</option>
                <option value="OUT_OF_STOCK">Нет в наличии</option>
              </select>
            </Field>
          </div>

          <Field label="Краткое описание" hint="Показывается в карточке каталога, 1–2 строки">
            <textarea name="shortDescription" defaultValue={initial.shortDescription} rows={2} className="textarea" />
          </Field>

          <Field label="Полное описание" hint="Показывается на странице товара">
            <textarea name="description" defaultValue={initial.description} rows={7} className="textarea" />
          </Field>
        </div>

        <div className="card p-5">
          <ImageUploader
            value={images}
            onChange={setImages}
            label="Фотографии"
            hint="Первое фото — главное"
          />
        </div>

        <div className="card p-5">
          <AttributesEditor value={attributes} onChange={setAttributes} />
        </div>
      </div>

      {/* ---------- Боковая колонка ---------- */}
      <div className="space-y-6">
        <div className="card space-y-3 p-5">
          <h2 className="text-[15px] font-bold">Публикация</h2>
          <FormMessage state={state} />

          <Toggle name="isActive" label="Опубликован" hint="Выключите — товар исчезнет с сайта, но останется в админке" defaultChecked={initial.isActive} />
          <Toggle name="showOnHome" label="Показывать на главной" defaultChecked={initial.showOnHome} />
          <Toggle name="isFeatured" label="Популярный" hint="Метка «Хит» и приоритет в каталоге" defaultChecked={initial.isFeatured} />
          <Toggle name="isNew" label="Новинка" defaultChecked={initial.isNew} />
          <Toggle name="isSale" label="Акция" defaultChecked={initial.isSale} />

          <div className="flex flex-wrap gap-2 pt-2">
            <SubmitButton>Сохранить</SubmitButton>
            <Link href="/admin/products" className="btn-outline btn-md">Отмена</Link>
            {initial.slug && (
              <Link href={`/product/${initial.slug}`} target="_blank" className="btn-ghost btn-md">
                <ExternalLink className="h-4 w-4" /> Смотреть
              </Link>
            )}
          </div>
        </div>

        <div className="card space-y-4 p-5">
          <h2 className="text-[15px] font-bold">Цена</h2>
          {!showPrices && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-[12px] leading-relaxed text-amber-800">
              Показ цен на сайте отключён в настройках — вместо цены посетитель увидит «Узнать цену».
              Значение всё равно можно сохранить.
            </p>
          )}
          <Field label="Цена, ₸">
            <input name="price" defaultValue={initial.price} inputMode="numeric" placeholder="5990" className="input" />
          </Field>
          <Field label="Старая цена, ₸" hint="Заполните для метки «Акция»">
            <input name="oldPrice" defaultValue={initial.oldPrice} inputMode="numeric" placeholder="" className="input" />
          </Field>
        </div>

        <div className="card space-y-4 p-5">
          <h2 className="text-[15px] font-bold">Дополнительно</h2>
          <Field label="Ссылка (slug)" hint="Оставьте пустым — сформируется из названия">
            <input name="slug" defaultValue={initial.slug} placeholder="dinosaur-trex" className="input" />
          </Field>
          <Field label="Ключевые слова" hint="Помогают поиску в каталоге">
            <input name="keywords" defaultValue={initial.keywords} placeholder="динозавр, t-rex, PLA" className="input" />
          </Field>
          <Field label="Порядок сортировки" hint="Меньше — выше в списке">
            <input name="sortOrder" defaultValue={initial.sortOrder} inputMode="numeric" className="input" />
          </Field>
        </div>
      </div>
    </form>
  );
}
