import type { ActiveOrder, CompletedOrder, Address, Notification, FavoriteProduct } from '../types/account';

export const MOCK_ACTIVE: ActiveOrder[] = [
  {
    id: '1',
    number: '00387',
    date: '18 апреля 2026',
    items: [
      { id: 4, name: 'Четки из оливкового дерева', price: 560, qty: 1, img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=400&fit=crop' },
      { id: 7, name: 'Ладан афонский',              price: 340, qty: 2, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop' },
    ],
    total: 1240,
    status: 'shipped',
  },
  {
    id: '2',
    number: '00392',
    date: '20 апреля 2026',
    items: [
      { id: 8, name: 'Псалтирь с толкованием', price: 890, qty: 1, img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop' },
    ],
    total: 890,
    status: 'placed',
  },
];

export const MOCK_HISTORY: CompletedOrder[] = [
  {
    id: '1',
    number: '00341',
    date: '15 марта 2024',
    items: [
      { id: 3, name: 'Икона Богородицы',            price: 2100, qty: 1, img: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/%D0%95%D0%BB%D0%B5%D1%86%D0%BA%D0%B0%D1%8F-%D0%A7%D0%B5%D1%80%D0%BD%D0%B8%D0%B3%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F_%D0%B8%D0%BA%D0%BE%D0%BD%D0%B0_%D0%91%D0%BE%D0%B6%D0%B8%D0%B5%D0%B9_%D0%9C%D0%B0%D1%82%D0%B5%D1%80%D0%B8.jpg' },
      { id: 6, name: 'Свечи церковные (набор 12 шт)', price: 180, qty: 2, img: 'https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?w=400&h=400&fit=crop' },
    ],
    total: 2460,
    status: 'delivered',
  },
  {
    id: '2',
    number: '00298',
    date: '22 января 2024',
    items: [
      { id: 2, name: 'Деревянный нательный крест', price: 390, qty: 1, img: 'https://ir.ozone.ru/s3/multimedia-1-e/c1000/6975420998.jpg' },
      { id: 5, name: 'Молитвослов православный',   price: 420, qty: 1, img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop' },
    ],
    total: 810,
    status: 'delivered',
  },
  {
    id: '3',
    number: '00187',
    date: '4 ноября 2023',
    items: [
      { id: 1, name: 'Библия в кожаном переплёте', price: 1290, qty: 1, img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=400&fit=crop' },
    ],
    total: 1290,
    status: 'delivered',
  },
];

export const MOCK_ADDRESSES: Address[] = [
  { id: '1', city: 'Москва',          street: 'ул. Тверская', house: '15', apartment: '42', isDefault: true },
  { id: '2', city: 'Санкт-Петербург', street: 'Невский пр-т', house: '88', apartment: '12', isDefault: false },
];

export const MOCK_FAVORITES: FavoriteProduct[] = [
  { id: 3, name: 'Икона Богородицы',            price: 2100, img: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/%D0%95%D0%BB%D0%B5%D1%86%D0%BA%D0%B0%D1%8F-%D0%A7%D0%B5%D1%80%D0%BD%D0%B8%D0%B3%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F_%D0%B8%D0%BA%D0%BE%D0%BD%D0%B0_%D0%91%D0%BE%D0%B6%D0%B8%D0%B5%D0%B9_%D0%9C%D0%B0%D1%82%D0%B5%D1%80%D0%B8.jpg', cat: 'Иконы' },
  { id: 1, name: 'Библия в кожаном переплёте',  price: 1290, img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=400&fit=crop', cat: 'Книги' },
  { id: 4, name: 'Четки из оливкового дерева',  price: 560,  img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=400&fit=crop', cat: 'Аксессуары' },
  { id: 8, name: 'Псалтирь с толкованием',      price: 890,  img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', cat: 'Книги' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', icon: 'delivery', text: 'Ваш заказ #00387 отправлен и уже в пути к вам',               date: '2 часа назад',   isRead: false },
  { id: '2', icon: 'order',    text: 'Заказ #00392 успешно оформлен и принят в обработку',           date: '1 день назад',   isRead: false },
  { id: '3', icon: 'promo',    text: 'Пасхальная скидка 10% на все иконы! До 28 апреля',             date: '2 дня назад',    isRead: true  },
  { id: '4', icon: 'order',    text: 'Ваш заказ #00341 успешно доставлен',                           date: '5 дней назад',   isRead: true  },
  { id: '5', icon: 'info',     text: 'Поступил новый товар: Мирра Иерусалимская',                    date: '1 неделю назад', isRead: true  },
];
