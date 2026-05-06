export type EventType = 'event' | 'holiday';

export type EventPoster = {
  image: string;
};

export type EventItem = {
  id: string;
  title: string;
  date: string;
  type: EventType;
  description?: string;
  poster?: EventPoster;
};

export const eventsBase: EventItem[] = [
  {
    id: '1',
    title: 'ПАЛОМНИЧЕСТВО',
    date: '2026-04-25T19:17:00',
    type: 'event',
    description: 'Паломническая поездка к святым местам.',
  },
  {
    id: '2',
    title: 'ПАСХА',
    date: '2026-04-07T21:11:00',
    type: 'holiday',
    description: 'Светлое Христово Воскресение — праздник праздников.',
    poster: { image: '/foto/изображение_2026-03-07_212824305-Photoroom.png' },
  },
  {
    id: '3',
    title: 'ВОЗНЕСЕНИЕ ГОСПОДНЕ',
    date: '2026-05-14T10:00:00',
    type: 'holiday',
    description: 'Вознесение Иисуса Христа на небо на сороковой день после Пасхи.',
  },
  {
    id: '4',
    title: 'БИБЛЕЙСКАЯ ШКОЛА',
    date: '2026-05-03',
    type: 'event',
    description: 'Занятия библейской школы для взрослых.',
  },
  {
    id: '5',
    title: 'ЦЕРКОВНЫЙ ПИКНИК',
    date: '2026-05-08',
    type: 'event',
    description: 'Общий пикник прихода. Не забудьте пледы!',
  },
  {
    id: '6',
    title: 'МИССИОНЕРСКАЯ ПОЕЗДКА',
    date: '2026-05-19',
    type: 'event',
    description: 'Миссионерская поездка на залив.',
  },
  {
    id: '7',
    title: 'ТРОИЦА',
    date: '2026-06-05',
    type: 'holiday',
    description: 'День Святой Троицы — Пятидесятница.',
  },
  {
    id: '8',
    title: 'ВСТРЕЧА МОЛОДЁЖИ',
    date: '2026-06-05',
    type: 'event',
    description: 'Ежемесячная встреча молодёжной группы.',
  },
  {
    id: '9',
    title: 'РЕПЕТИЦИЯ ХОРА',
    date: '2026-06-05',
    type: 'event',
    description: 'Репетиция церковного хора перед праздником.',
  },
];
