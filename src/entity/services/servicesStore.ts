import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FATHERS_DATA } from '../../data/fatherData';
import { INITIAL_ORDERS } from '../../data/ordersData';

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
  img: string;
  bio: string;
  schedule: { date: string; times: string[] }[];
}

const INITIAL_PRIESTS: PriestData[] = FATHERS_DATA.map((father) => ({
  id: String(father.id),
  name: father.name,
  rank: father.rank,
  img: father.img,
  bio: father.bio,
  schedule: father.schedule ?? [],
}));

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
    { name: 'services-storage-v3' }
  )
);
