import type { PrismaClient, ProductStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const img = (n: string) => `/uploads/demo/${n}.svg`;

// ---------------------------------------------------------------- настройки
export const SETTINGS: Record<string, string> = {
  company_name: 'Cleanology',
  company_tagline: 'Бытовая химия и клининговые услуги',
  logo: '',
  phone: '+7 700 123 45 67',
  whatsapp: '77001234567',
  whatsapp_text: 'Здравствуйте! Меня интересует',
  instagram: 'https://instagram.com/',
  telegram: '',
  email: 'info@cleanology.kz',
  address: 'г. Алматы, ул. Примерная, 10',
  work_hours: 'Пн–Сб, 9:00–19:00',
  show_prices: '1',
  about_page_title: 'О компании',
  about_page_text:
    'Cleanology — поставщик бытовой химии и товаров для дома в Казахстане. ' +
    'Мы работаем напрямую с производителями и официальными дистрибьюторами, поэтому в каталоге ' +
    'только оригинальная продукция проверенных брендов: Persil, Ariel, Fairy, Domestos, Cif, Lenor и другие.\n\n' +
    'Кроме розницы и опта мы оказываем клининговые услуги: генеральная и поддерживающая уборка, ' +
    'уборка после ремонта, мытьё окон. Отдельное направление — химчистка мягкой мебели, ковров, ' +
    'матрасов и салонов автомобилей. Работаем профессиональным оборудованием и составами, ' +
    'которые сами же и поставляем.\n\n' +
    'Доставка по Алматы и всему Казахстану. Стоимость уборки и химчистки считаем индивидуально — ' +
    'она зависит от площади, состояния объекта и объёма работ. Напишите в WhatsApp, и мы рассчитаем.',
};

// ---------------------------------------------------------------- главная
export const HOME = {
  heroTitle: 'Бытовая химия',
  heroAccent: 'для чистоты и уюта',
  heroSubtitle: 'вашего дома',
  heroText:
    'Широкий ассортимент качественной бытовой химии по доступным ценам. ' +
    'А также профессиональный клининг и химчистка с выездом по Алматы.',
  heroImage: img('hero-clean'),
  heroButtonText: 'Смотреть каталог',
  aboutTitle: 'О компании',
  aboutText:
    'Мы поставляем бытовую химию проверенных брендов и сами оказываем услуги уборки и химчистки. ' +
    'Знаем свою продукцию не по описаниям с упаковки, а по работе с ней каждый день — ' +
    'поэтому подскажем, что действительно подойдёт под вашу задачу.',
  aboutImage: img('about-clean'),
  aboutStat1Value: '5+ лет',
  aboutStat1Label: 'на рынке',
  aboutStat2Value: '1000+',
  aboutStat2Label: 'довольных клиентов',
  aboutStat3Value: '500+',
  aboutStat3Label: 'товаров в каталоге',
  ctaTitle: 'Не нашли нужное средство?',
  ctaText:
    'Напишите нам в WhatsApp — поможем подобрать вариант для вашего дома ' +
    'и рассчитаем стоимость уборки или химчистки.',
};

// ---------------------------------------------------------------- преимущества
export const ADVANTAGES = [
  { title: 'Качество', text: 'Только оригинальная продукция от проверенных производителей', icon: 'shield' },
  { title: 'Выгодные цены', text: 'Доступные цены и регулярные скидки для постоянных клиентов', icon: 'tag' },
  { title: 'Быстрая доставка', text: 'Оперативная доставка по Алматы и всему Казахстану', icon: 'truck' },
  { title: 'Поддержка', text: 'Менеджер поможет с выбором средства и расчётом уборки', icon: 'headphones' },
];

// ---------------------------------------------------------------- категории
export const CATEGORIES = [
  { name: 'Для стирки', slug: 'dlya-stirki', image: 'cat-laundry', description: 'Порошки, гели и кондиционеры для белья' },
  { name: 'Для мытья посуды', slug: 'dlya-posudy', image: 'cat-dishes', description: 'Средства для рук и посудомоечных машин' },
  { name: 'Для ванной и туалета', slug: 'dlya-vannoy', image: 'cat-bath', description: 'Средства против известкового налёта и ржавчины' },
  { name: 'Для пола и поверхностей', slug: 'dlya-pola', image: 'cat-floor', description: 'Средства для мытья полов, стен и мебели' },
  { name: 'Универсальные средства', slug: 'universalnye', image: 'cat-universal', description: 'Подходят для большинства поверхностей' },
  { name: 'Освежители воздуха', slug: 'osvezhiteli', image: 'cat-air', description: 'Спреи, автоматические баллоны и саше' },
  { name: 'Инвентарь для уборки', slug: 'inventar', image: 'cat-tools', description: 'Швабры, вёдра, салфетки, перчатки' },
  { name: 'Профессиональная химия', slug: 'professionalnaya-himiya', image: 'cat-pro', description: 'Концентраты для клининга и производств' },
  { name: 'Клининг', slug: 'kliningovye-uslugi', image: 'cat-cleaning', description: 'Уборка квартир, офисов и помещений после ремонта' },
  { name: 'Химчистка', slug: 'himchistka', image: 'cat-drycleaning', description: 'Мягкая мебель, ковры, матрасы, салоны авто' },
];

// ---------------------------------------------------------------- товары и услуги
type Item = {
  name: string;
  slug: string;
  category: string;
  price: number | null;
  oldPrice?: number;
  image: string;
  short: string;
  description: string;
  status?: ProductStatus;
  isNew?: boolean;
  isSale?: boolean;
  featured?: boolean;
  onHome?: boolean;
  keywords: string;
  attrs: [string, string][];
};

const shopDescription = (name: string, extra: string) =>
  `${name} — оригинальная продукция, поставляется напрямую от официального дистрибьютора. ${extra}\n\n` +
  'Есть в наличии в розницу и мелким оптом. Нужен другой объём или большая партия — ' +
  'напишите в WhatsApp, посчитаем цену под ваш объём.';

const serviceDescription = (name: string, extra: string) =>
  `${name}. ${extra}\n\n` +
  'Работаем профессиональным оборудованием и составами, которые сами же и поставляем. ' +
  'Стоимость зависит от площади, состояния объекта и объёма работ — назовите детали в WhatsApp, ' +
  'и мы посчитаем точную сумму и подберём удобное время.';

export const ITEMS: Item[] = [
  // ---------- бытовая химия ----------
  {
    name: 'Persil Color, стиральный порошок', slug: 'persil-color-poroshok',
    category: 'dlya-stirki', price: 3200, image: 'ch-01',
    short: 'Для цветного белья, 3 кг', featured: true, onHome: true,
    description: shopDescription('Persil Color', 'Сохраняет яркость цветных тканей, работает от 30 °C. Хватает примерно на 40 стирок.'),
    keywords: 'persil персил порошок стирка цветное бельё',
    attrs: [['Бренд', 'Persil'], ['Вес', '3 кг'], ['Назначение', 'Цветное бельё'], ['Форма выпуска', 'Порошок']],
  },
  {
    name: 'Ariel, гель для стирки', slug: 'ariel-gel-dlya-stirki',
    category: 'dlya-stirki', price: 2950, image: 'ch-02',
    short: 'Универсальный концентрат, 1.3 л', onHome: true,
    description: shopDescription('Ariel', 'Концентрированный гель, растворяется даже в холодной воде и не оставляет разводов.'),
    keywords: 'ariel ариэль гель стирка концентрат',
    attrs: [['Бренд', 'Ariel'], ['Объём', '1.3 л'], ['Назначение', 'Универсальное'], ['Форма выпуска', 'Гель']],
  },
  {
    name: 'Lenor, кондиционер для белья', slug: 'lenor-konditsioner',
    category: 'dlya-stirki', price: 2200, image: 'ch-03',
    short: 'Концентрат, 1.8 л',
    description: shopDescription('Lenor', 'Смягчает ткань и облегчает глажку, аромат держится до следующей стирки.'),
    keywords: 'lenor ленор кондиционер ополаскиватель бельё',
    attrs: [['Бренд', 'Lenor'], ['Объём', '1.8 л'], ['Назначение', 'Смягчение белья'], ['Форма выпуска', 'Концентрат']],
  },
  {
    name: 'Fairy, средство для мытья посуды', slug: 'fairy-dlya-posudy',
    category: 'dlya-posudy', price: 1150, image: 'ch-04',
    short: 'Лимон, 900 мл', featured: true, onHome: true,
    description: shopDescription('Fairy', 'Справляется с жиром в холодной воде, экономно расходуется.'),
    keywords: 'fairy фейри посуда средство жир лимон',
    attrs: [['Бренд', 'Fairy'], ['Объём', '900 мл'], ['Назначение', 'Мытьё посуды'], ['Аромат', 'Лимон']],
  },
  {
    name: 'Finish, таблетки для посудомоечных машин', slug: 'finish-tabletki-pmm',
    category: 'dlya-posudy', price: 2900, oldPrice: 3400, image: 'ch-05',
    short: 'All in 1, 30 шт', isSale: true, onHome: true,
    description: shopDescription('Finish All in 1', 'Соль, ополаскиватель и моющее средство в одной таблетке — отдельные добавки не нужны.'),
    keywords: 'finish финиш таблетки посудомоечная машина пмм',
    attrs: [['Бренд', 'Finish'], ['Количество', '30 шт'], ['Назначение', 'Посудомоечные машины'], ['Форма выпуска', 'Таблетки']],
  },
  {
    name: 'Domestos, чистящее средство', slug: 'domestos-chistyashchee',
    category: 'dlya-vannoy', price: 1100, image: 'ch-06',
    short: 'Дезинфицирующий гель, 1 л', featured: true, onHome: true,
    description: shopDescription('Domestos', 'Густой гель не стекает с вертикальных поверхностей, убирает налёт и запах.'),
    keywords: 'domestos доместос унитаз гель дезинфекция',
    attrs: [['Бренд', 'Domestos'], ['Объём', '1 л'], ['Назначение', 'Сантехника'], ['Форма выпуска', 'Гель']],
  },
  {
    name: 'Cif, крем для чистки', slug: 'cif-krem-dlya-chistki',
    category: 'dlya-vannoy', price: 1250, image: 'ch-07',
    short: 'Активный лимон, 500 мл',
    description: shopDescription('Cif', 'Микрогранулы снимают налёт, не царапая эмаль, плитку и нержавейку.'),
    keywords: 'cif сиф крем чистка налёт плитка',
    attrs: [['Бренд', 'Cif'], ['Объём', '500 мл'], ['Назначение', 'Плитка, эмаль, сталь'], ['Форма выпуска', 'Крем']],
  },
  {
    name: 'Mr. Proper, средство для мытья полов', slug: 'mr-proper-dlya-pola',
    category: 'dlya-pola', price: 1350, image: 'ch-08',
    short: 'Универсальное, 1 л', onHome: true,
    description: shopDescription('Mr. Proper', 'Подходит для ламината, плитки и линолеума, не требует смывания.'),
    keywords: 'mr proper мистер пропер пол ламинат плитка',
    attrs: [['Бренд', 'Mr. Proper'], ['Объём', '1 л'], ['Назначение', 'Полы'], ['Форма выпуска', 'Концентрат']],
  },
  {
    name: 'Спрей-антижир для кухни', slug: 'sprey-antizhir',
    category: 'universalnye', price: 1450, image: 'ch-09',
    short: 'Против жира и нагара, 500 мл', isNew: true,
    description: shopDescription('Спрей-антижир', 'Растворяет застарелый жир на плите, вытяжке и духовке за пару минут.'),
    keywords: 'антижир спрей кухня жир нагар вытяжка',
    attrs: [['Объём', '500 мл'], ['Назначение', 'Кухонные поверхности'], ['Форма выпуска', 'Спрей'], ['Аромат', 'Нейтральный']],
  },
  {
    name: 'Glade, освежитель воздуха', slug: 'glade-osvezhitel',
    category: 'osvezhiteli', price: 790, image: 'ch-10',
    short: 'Цветочный аромат, 300 мл',
    description: shopDescription('Glade', 'Нейтрализует запах, а не маскирует его. Хватает примерно на месяц ежедневного использования.'),
    keywords: 'glade глейд освежитель воздуха аэрозоль аромат',
    attrs: [['Бренд', 'Glade'], ['Объём', '300 мл'], ['Назначение', 'Освежение воздуха'], ['Форма выпуска', 'Аэрозоль']],
  },
  {
    name: 'Влажные салфетки универсальные', slug: 'vlazhnye-salfetki',
    category: 'inventar', price: 850, image: 'ch-11',
    short: 'Для дома, 80 шт',
    description: shopDescription('Влажные салфетки', 'Плотные, не рвутся при отжиме, подходят для техники и мебели.'),
    keywords: 'салфетки влажные уборка дом',
    attrs: [['Количество', '80 шт'], ['Назначение', 'Универсальное'], ['Материал', 'Нетканое полотно'], ['Упаковка', 'Мягкая, с клапаном']],
  },
  {
    name: 'Набор для уборки', slug: 'nabor-dlya-uborki',
    category: 'inventar', price: 3990, image: 'cat-tools',
    short: 'Ведро, швабра, насадка, перчатки',
    description: shopDescription('Набор для уборки', 'Ведро с отжимом, швабра с телескопической ручкой, сменная насадка из микрофибры и перчатки.'),
    keywords: 'набор уборка ведро швабра перчатки инвентарь',
    attrs: [['Комплектация', '4 предмета'], ['Объём ведра', '12 л'], ['Материал насадки', 'Микрофибра'], ['Ручка', 'Телескопическая']],
  },
  {
    name: 'Жидкое мыло с алоэ', slug: 'zhidkoe-mylo-aloe',
    category: 'universalnye', price: 950, image: 'ch-13',
    short: 'Алоэ вера, 500 мл', isNew: true,
    description: shopDescription('Жидкое мыло с алоэ', 'Мягкая формула с глицерином, подходит для частого мытья рук.'),
    keywords: 'мыло жидкое алоэ руки дозатор',
    attrs: [['Объём', '500 мл'], ['Назначение', 'Мытьё рук'], ['Форма выпуска', 'Жидкое мыло'], ['Дозатор', 'В комплекте']],
  },
  {
    name: 'Обезжириватель профессиональный', slug: 'obezzhirivatel-prof',
    category: 'professionalnaya-himiya', price: 6900, image: 'ch-12',
    short: 'Концентрат, канистра 5 л', status: 'ON_ORDER',
    description: shopDescription('Профессиональный обезжириватель', 'Концентрат для клининговых компаний и пищевых производств, разводится 1:20.'),
    keywords: 'профессиональная химия обезжириватель концентрат канистра клининг',
    attrs: [['Объём', '5 л'], ['Назначение', 'Профессиональная уборка'], ['Разведение', 'до 1:20'], ['Форма выпуска', 'Концентрат']],
  },

  // ---------- услуги (цена по запросу) ----------
  {
    name: 'Генеральная уборка квартиры', slug: 'generalnaya-uborka',
    category: 'kliningovye-uslugi', price: null, image: 'sv-01',
    short: 'Полная уборка всех помещений', featured: true, onHome: true,
    description: serviceDescription(
      'Генеральная уборка квартиры или дома',
      'Моем полы, стены, окна изнутри, сантехнику, кухонный гарнитур снаружи и внутри, технику, светильники и двери. Убираем известковый налёт и жир.'),
    keywords: 'генеральная уборка квартира клининг услуги',
    attrs: [['Выезд', 'Алматы и пригород'], ['Время работы', 'от 4 часов'], ['Материалы', 'Наши, входят в стоимость'], ['Минимальный заказ', '1 помещение']],
  },
  {
    name: 'Поддерживающая уборка', slug: 'podderzhivayushchaya-uborka',
    category: 'kliningovye-uslugi', price: null, image: 'sv-02',
    short: 'Регулярная уборка квартир и офисов',
    description: serviceDescription(
      'Поддерживающая уборка',
      'Полы, пыль, санузел, кухня, вынос мусора. Можно заказать разово или по графику — раз в неделю, две или каждый день для офиса.'),
    keywords: 'поддерживающая уборка регулярная офис квартира клининг',
    attrs: [['Выезд', 'Алматы'], ['Время работы', 'от 2 часов'], ['График', 'Разово или регулярно'], ['Материалы', 'Наши, входят в стоимость']],
  },
  {
    name: 'Уборка после ремонта', slug: 'uborka-posle-remonta',
    category: 'kliningovye-uslugi', price: null, image: 'sv-03',
    short: 'Строительная пыль, следы краски и клея',
    description: serviceDescription(
      'Уборка после ремонта',
      'Убираем строительную пыль со всех поверхностей, следы краски, монтажной пены, клея и скотча. Моем окна, откосы и радиаторы.'),
    keywords: 'уборка после ремонта строительная пыль клининг',
    attrs: [['Выезд', 'Алматы и пригород'], ['Время работы', 'от 5 часов'], ['Оборудование', 'Промышленные пылесосы'], ['Материалы', 'Наши, входят в стоимость']],
  },
  {
    name: 'Мытьё окон и остекления', slug: 'mytyo-okon',
    category: 'kliningovye-uslugi', price: null, image: 'sv-04',
    short: 'Окна, балконы, витражи',
    description: serviceDescription(
      'Мытьё окон и остекления',
      'Моем стёкла с двух сторон, рамы, откосы, подоконники и москитные сетки. Работаем с панорамным остеклением и балконами.'),
    keywords: 'мытьё окон стёкла балкон витраж клининг',
    attrs: [['Выезд', 'Алматы'], ['Расчёт', 'По количеству створок'], ['Что входит', 'Стекло, рама, откос, сетка'], ['Материалы', 'Наши, входят в стоимость']],
  },
  {
    name: 'Химчистка мягкой мебели', slug: 'himchistka-mebeli',
    category: 'himchistka', price: null, image: 'sv-05',
    short: 'Диваны, кресла, стулья', featured: true, onHome: true,
    description: serviceDescription(
      'Химчистка мягкой мебели',
      'Экстракторная чистка с подбором состава под тип обивки. Убираем пятна, запахи и следы от животных.'),
    keywords: 'химчистка мебели диван кресло обивка на дому',
    attrs: [['Выезд', 'На дом или в офис'], ['Время работы', 'от 1.5 часов'], ['Сушка', '4–8 часов'], ['Расчёт', 'По количеству посадочных мест']],
  },
  {
    name: 'Химчистка ковров', slug: 'himchistka-kovrov',
    category: 'himchistka', price: null, image: 'sv-06',
    short: 'На дому или с вывозом',
    description: serviceDescription(
      'Химчистка ковров и ковролина',
      'Чистим на месте или забираем в цех — при сильном загрязнении второй вариант эффективнее. Ворс не заминается, цвет остаётся.'),
    keywords: 'химчистка ковров ковролин вывоз на дому',
    attrs: [['Выезд', 'Алматы'], ['Расчёт', 'За квадратный метр'], ['Варианты', 'На дому или с вывозом'], ['Сушка', 'до 12 часов']],
  },
  {
    name: 'Химчистка матрасов', slug: 'himchistka-matrasov',
    category: 'himchistka', price: null, image: 'sv-07',
    short: 'Глубокая чистка с обработкой',
    description: serviceDescription(
      'Химчистка матрасов',
      'Глубокая экстракторная чистка с удалением пятен, запахов и пылевых клещей. Обработка антибактериальным составом по желанию.'),
    keywords: 'химчистка матраса чистка кровать клещи',
    attrs: [['Выезд', 'На дом'], ['Время работы', 'от 1 часа'], ['Сушка', '4–6 часов'], ['Расчёт', 'По размеру матраса']],
  },
  {
    name: 'Химчистка салона автомобиля', slug: 'himchistka-avto',
    category: 'himchistka', price: null, image: 'sv-08',
    short: 'Сиденья, потолок, панель, багажник',
    description: serviceDescription(
      'Химчистка салона автомобиля',
      'Сиденья, потолок, карты дверей, пластик, ковролин и багажник. Убираем пятна и застоявшийся запах.'),
    keywords: 'химчистка авто салон машина сиденья потолок',
    attrs: [['Место', 'Наш бокс или ваш адрес'], ['Время работы', 'от 3 часов'], ['Сушка', '3–5 часов'], ['Расчёт', 'По классу автомобиля']],
  },
];

// ---------------------------------------------------------------- посев
export async function seed(prisma: PrismaClient) {
  // Администратор
  const email = (process.env.ADMIN_EMAIL || 'admin@site.kz').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin12345';
  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { name: 'Администратор', email, passwordHash: await bcrypt.hash(password, 10) },
  });

  // Настройки
  for (const [key, value] of Object.entries(SETTINGS)) {
    await prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }

  // Контент главной
  await prisma.homeContent.upsert({ where: { id: 1 }, update: HOME, create: { id: 1, ...HOME } });

  // Преимущества
  if ((await prisma.advantage.count()) === 0) {
    await prisma.advantage.createMany({
      data: ADVANTAGES.map((a, i) => ({ ...a, sortOrder: i, isActive: true })),
    });
  }

  // Категории
  for (const [i, c] of CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        name: c.name,
        slug: c.slug,
        description: c.description,
        imageUrl: img(c.image),
        sortOrder: i,
        isActive: true,
      },
    });
  }

  const catId = Object.fromEntries(
    (await prisma.category.findMany({ select: { id: true, slug: true } })).map((c) => [c.slug, c.id]),
  );

  // Товары и услуги
  for (const [i, item] of ITEMS.entries()) {
    if (await prisma.product.findUnique({ where: { slug: item.slug } })) continue;

    await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        shortDescription: item.short,
        description: item.description,
        price: item.price,
        oldPrice: item.oldPrice ?? null,
        categoryId: catId[item.category] ?? null,
        status: item.status ?? 'IN_STOCK',
        isActive: true,
        isFeatured: item.featured ?? false,
        isNew: item.isNew ?? false,
        isSale: item.isSale ?? false,
        showOnHome: item.onHome ?? false,
        keywords: item.keywords,
        sortOrder: i,
        images: { create: [{ imageUrl: img(item.image), isMain: true, sortOrder: 0 }] },
        attributes: {
          create: item.attrs.map(([name, value], idx) => ({ name, value, sortOrder: idx })),
        },
      },
    });
  }

  const [products, categories] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
  ]);
  console.log(`Готово. Позиций: ${products}, категорий: ${categories}.`);
  console.log(`Вход в админку: ${email} / ${password}`);
}
