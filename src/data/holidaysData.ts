import type { Holiday } from '../types/holiday';

export const HOLIDAYS: Holiday[] = [
  { id: 1, name: 'День Независимости', date: new Date(new Date().getFullYear(), 7, 27) },
  { id: 2, name: 'Рождество Христово', date: new Date(new Date().getFullYear(), 11, 25) },
  { id: 3, name: 'Новый год',          date: new Date(new Date().getFullYear() + 1, 0, 1) },
  { id: 4, name: 'День Победы',        date: new Date(new Date().getFullYear(), 4, 9) },
  { id: 5, name: 'Пасха',              date: new Date(new Date().getFullYear(), 3, 20) },
];
