import type { CeremonyItem, MusicTrack } from '../types/media';

const BASE = import.meta.env.BASE_URL;

export const DEFAULT_CEREMONY_ITEMS: CeremonyItem[] = [
  { id: 'c1', title: 'Выход жениха',          musicName: 'Пахельбель — Канон ре мажор',        url: `${BASE}audio/c1.mp3`, cover: `${BASE}ceremony/c1.jpg` },
  { id: 'c2', title: 'Выход невесты',          musicName: 'Вагнер — Хор женихов',              url: `${BASE}audio/c2.mp3`, cover: `${BASE}ceremony/c2.jpg` },
  { id: 'c3', title: 'Клятвы',                 musicName: 'Бах — Ария на струне G',            url: `${BASE}audio/c3.mp3`, cover: `${BASE}ceremony/c3.jpg` },
  { id: 'c4', title: 'Обмен кольцами',         musicName: 'Шуберт — Аве Мария',               url: `${BASE}audio/c4.mp3`, cover: `${BASE}ceremony/c4.jpg` },
  { id: 'c5', title: 'Поцелуй',                musicName: 'Мендельсон — Свадебный марш',      url: `${BASE}audio/c5.mp3`, cover: `${BASE}ceremony/c5.jpg` },
  { id: 'c6', title: 'Вручение свидетельства', musicName: 'Гендель — Аллилуйя',              url: `${BASE}audio/c6.mp3`, cover: `${BASE}ceremony/c6.jpg` },
  { id: 'c7', title: 'Поздравления',           musicName: 'Бетховен — Ода к радости',        url: `${BASE}audio/c7.mp3`, cover: `${BASE}ceremony/c7.jpg` },
  { id: 'c8', title: 'Выход пары',             musicName: 'Пахельбель — Канон (финал)',       url: `${BASE}audio/c8.mp3`, cover: `${BASE}ceremony/c8.jpg` },
  { id: 'c9', title: 'Фуршет',                 musicName: 'Вивальди — Времена года: Весна',  url: `${BASE}audio/c9.mp3`, cover: `${BASE}ceremony/c9.jpg` },
];

// Church music playlist — mix of well-known public domain pieces and local tracks.
// URLs for external tracks can be updated via the admin panel (Медиа → Плейлист).
export const DEFAULT_MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'ch-1',
    title: 'Аллилуйя',
    author: 'Гендель',
    url: 'https://archive.org/download/pachebelcanon/pachebelcanon.mp3',
    cover: `${BASE}icons/logo.png`,
  },
  {
    id: 'ch-2',
    title: 'Аве Мария',
    author: 'Шуберт',
    url: 'https://archive.org/download/SchubertAveMaria_201710/Schubert_Ave_Maria.mp3',
    cover: `${BASE}icons/logo.png`,
  },
  {
    id: 'ch-3',
    title: 'Иисус, радость человеков',
    author: 'И. С. Бах',
    url: 'https://archive.org/download/JesuJoyOfMansDesiring_201710/Jesu_Joy_of_Mans_Desiring.mp3',
    cover: `${BASE}icons/logo.png`,
  },
  {
    id: 'ch-4',
    title: 'Ода к радости',
    author: 'Бетховен',
    url: 'https://archive.org/download/BeethovenOdeToJoy/Beethoven_-_Ode_to_Joy.mp3',
    cover: `${BASE}icons/logo.png`,
  },
  {
    id: 'ch-5',
    title: 'Kyrie Eleison',
    author: 'Моцарт',
    url: 'https://archive.org/download/MozartRequiem/Mozart_Requiem_Kyrie.mp3',
    cover: `${BASE}icons/logo.png`,
  },
  {
    id: 'loc-1',
    title: 'Ярмарка судеб (1)',
    author: 'Alena',
    url: `${BASE}audio/Alena - Ярмарка судеб (1).mp3`,
    cover: `${BASE}icons/logo.png`,
  },
  {
    id: 'loc-2',
    title: 'Ярмарка судеб (2)',
    author: 'Alena',
    url: `${BASE}audio/Alena - Ярмарка судеб (2).mp3`,
    cover: `${BASE}icons/logo.png`,
  },
  {
    id: 'loc-3',
    title: 'Ярмарка судеб',
    author: 'Alena',
    url: `${BASE}audio/Alena - Ярмарка судеб.mp3`,
    cover: `${BASE}icons/logo.png`,
  },
  {
    id: 'loc-4',
    title: 'Я пришел к тебе с приветом',
    author: 'Daram Dam & YOKU',
    url: `${BASE}audio/Daram Dam & YOKU - Я пришел к тебе с приветом.mp3`,
    cover: `${BASE}icons/logo.png`,
  },
];

// Church video links — replace via admin panel (Медиа → Видео).
export const DEFAULT_VIDEO_URLS: string[] = [
  'https://www.youtube.com/watch?v=bTvmZE5z5RQ', // Handel — Hallelujah Chorus
  'https://www.youtube.com/watch?v=JvNQLJ1_HQ0', // Pachelbel — Canon in D
  'https://www.youtube.com/watch?v=2-6M89Nu5Qs', // Orthodox Divine Liturgy
];
