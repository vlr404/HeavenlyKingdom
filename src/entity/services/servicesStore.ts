import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ServiceOrder {
  id: string;
  serviceId: string;
  serviceName: string;
  priestId: string;
  priestName: string;
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface PriestData {
  id: string;
  name: string;
  rank: string;
  experience: number;
  rating: number;
  bio: string;
  schedule: { date: string; times: string[] }[];
}

const INITIAL_PRIESTS: PriestData[] = [
  {
    id: 'priest1',
    name: 'Николай Чудотворец',
    rank: 'Иерей',
    experience: 15,
    rating: 4.9,
    bio: 'Служу в храме Святой Троицы более 15 лет. Специализация: таинства, молебны, требы на дому.',
    schedule: [
      { date: '2026-05-05', times: ['09:00', '11:00', '14:00', '16:00'] },
      { date: '2026-05-06', times: ['10:00', '13:00', '15:00'] },
      { date: '2026-05-07', times: ['09:00', '12:00', '16:00'] },
      { date: '2026-05-08', times: ['11:00', '14:00', '17:00'] },
      { date: '2026-05-10', times: ['09:00', '11:00', '14:00'] },
      { date: '2026-05-12', times: ['10:00', '15:00', '17:00'] },
      { date: '2026-05-14', times: ['09:00', '12:00', '15:00'] },
    ],
  },
  {
    id: 'priest2',
    name: 'Александр Просветов',
    rank: 'Протоиерей',
    experience: 22,
    rating: 4.8,
    bio: 'Настоятель прихода. Более 22 лет пастырского служения. Совершаю все виды треб и таинств.',
    schedule: [
      { date: '2026-05-05', times: ['10:00', '13:00', '16:00'] },
      { date: '2026-05-06', times: ['09:00', '11:00', '15:00'] },
      { date: '2026-05-09', times: ['10:00', '12:00', '14:00'] },
      { date: '2026-05-11', times: ['09:00', '13:00', '16:00'] },
      { date: '2026-05-13', times: ['11:00', '14:00'] },
    ],
  },
  {
    id: 'priest3',
    name: 'Василий Великий',
    rank: 'Диакон',
    experience: 7,
    rating: 4.7,
    bio: 'Посвящён 7 лет назад. Провожу крещения, венчания и панихиды. Открыт к требам на дому.',
    schedule: [
      { date: '2026-05-05', times: ['11:00', '15:00', '17:00'] },
      { date: '2026-05-07', times: ['10:00', '14:00'] },
      { date: '2026-05-08', times: ['09:00', '12:00', '16:00'] },
      { date: '2026-05-10', times: ['10:00', '13:00', '15:00'] },
      { date: '2026-05-14', times: ['09:00', '11:00', '14:00', '16:00'] },
    ],
  },
];

const INITIAL_ORDERS: ServiceOrder[] = [
  {
    id: 'order1',
    serviceId: 'baptism',
    serviceName: 'Крещение',
    priestId: 'priest1',
    priestName: 'Николай Чудотворец',
    clientName: 'Мария Петрова',
    clientEmail: 'maria@example.com',
    date: '2026-05-10',
    time: '09:00',
    notes: 'Крестить младенца 2 месяцев, дочь Анна',
    status: 'pending',
    createdAt: '2026-04-26T14:30:00.000Z',
  },
  {
    id: 'order2',
    serviceId: 'prayer',
    serviceName: 'Молебен',
    priestId: 'priest1',
    priestName: 'Николай Чудотворец',
    clientName: 'Иван Сидоров',
    clientEmail: 'ivan@example.com',
    date: '2026-05-10',
    time: '11:00',
    notes: 'Молебен о здравии тяжелобольной матери',
    status: 'pending',
    createdAt: '2026-04-25T09:15:00.000Z',
  },
  {
    id: 'order3',
    serviceId: 'blessing',
    serviceName: 'Освящение жилища',
    priestId: 'priest1',
    priestName: 'Николай Чудотворец',
    clientName: 'Анна Козлова',
    clientEmail: 'anna@example.com',
    date: '2026-05-08',
    time: '14:00',
    notes: 'Новая квартира, адрес: ул. Мира 15, кв. 3',
    status: 'accepted',
    createdAt: '2026-04-20T16:00:00.000Z',
  },
  {
    id: 'order4',
    serviceId: 'wedding',
    serviceName: 'Венчание',
    priestId: 'priest1',
    priestName: 'Николай Чудотворец',
    clientName: 'Пётр и Светлана Романовы',
    clientEmail: 'romanov@example.com',
    date: '2026-05-14',
    time: '12:00',
    notes: 'Бракосочетание. Просим освятить кольца.',
    status: 'pending',
    createdAt: '2026-04-24T11:00:00.000Z',
  },
];

interface ServicesStore {
  orders: ServiceOrder[];
  priests: PriestData[];
  addOrder: (order: Omit<ServiceOrder, 'id' | 'status' | 'createdAt'>) => void;
  updateOrderStatus: (id: string, status: 'accepted' | 'rejected') => void;
  updatePriest: (id: string, data: Partial<PriestData>) => void;
  getBookedSlots: (priestId: string) => { date: string; time: string }[];
}

export const useServicesStore = create<ServicesStore>()(
  persist(
    (set, get) => ({
      orders: INITIAL_ORDERS,
      priests: INITIAL_PRIESTS,
      addOrder: (order) =>
        set((state) => ({
          orders: [
            ...state.orders,
            {
              ...order,
              id: String(Date.now()),
              status: 'pending',
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
      updatePriest: (id, data) =>
        set((state) => ({
          priests: state.priests.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),
      getBookedSlots: (priestId) => {
        const { orders } = get();
        return orders
          .filter((o) => o.priestId === priestId && o.status !== 'rejected')
          .map((o) => ({ date: o.date, time: o.time }));
      },
    }),
    { name: 'services-storage' }
  )
);
