import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { auth } from '@/lib/auth';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_BYTES = 8 * 1024 * 1024;

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
};

/**
 * Куда сохранять файлы.
 *
 * Есть BLOB_READ_WRITE_TOKEN — Vercel Blob. На Vercel это единственный рабочий вариант:
 * файловая система там доступна только для чтения.
 *
 * Нет токена — локальная папка public/uploads. Подходит для разработки
 * и для своего сервера (VPS, Docker), где диск пишется нормально.
 */
const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function saveToBlob(file: File, filename: string) {
  const { put } = await import('@vercel/blob');
  const blob = await put(filename, file, { access: 'public', addRandomSuffix: false });
  return blob.url;
}

async function saveToDisk(file: File, filename: string) {
  const dir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${filename}`;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
  }

  const form = await req.formData();
  const files = form.getAll('files').filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: 'Файлы не переданы' }, { status: 400 });
  }

  const urls: string[] = [];

  for (const file of files) {
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: `Формат ${file.type || 'неизвестен'} не поддерживается` },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: `Файл «${file.name}» больше 8 МБ` }, { status: 400 });
    }

    const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${EXT[file.type]}`;

    try {
      urls.push(useBlob ? await saveToBlob(file, filename) : await saveToDisk(file, filename));
    } catch (e) {
      console.error('Ошибка загрузки файла:', e);
      return NextResponse.json(
        {
          error: useBlob
            ? 'Не удалось сохранить файл в хранилище. Проверьте BLOB_READ_WRITE_TOKEN.'
            : 'Не удалось сохранить файл на диск. Если сайт развёрнут на Vercel, подключите Vercel Blob.',
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ urls });
}
