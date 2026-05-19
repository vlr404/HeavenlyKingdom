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
  img: string;
  bio: string;
  schedule: { date: string; times: string[] }[];
}

interface ServicesStore {
  orders: ServiceOrder[];
  priests: PriestData[];
  addOrder: (order: Omit<ServiceOrder, 'id' | 'status' | 'createdAt'>) => void;
  updateOrderStatus: (id: string, status: 'accepted' | 'rejected') => void;
  setPriests: (priests: PriestData[]) => void;
  getBookedSlots: (priestId: string) => { date: string; time: string }[];
}

export const useServicesStore = create<ServicesStore>()(
  persist(
    (set, get) => ({
      orders: [],
      priests: [],
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
      setPriests: (priests) => set({ priests }),
      getBookedSlots: (priestId) => {
        const { orders } = get();
        return orders
          .filter((o) => o.priestId === priestId && o.status !== 'rejected')
          .map((o) => ({ date: o.date, time: o.time }));
      },
    }),
    { name: 'services-storage-v4' }
  )
);
