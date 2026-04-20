import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../../types';

export interface CartItem extends Product {
  qty: number;
}

export interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  changeQty: (id: number, delta: number) => void;
  clearCart: () => void;
  totalCount: () => number;
  totalSum: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
              ),
            };
          }
          return { items: [...state.items, { ...product, qty: 1 }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      changeQty: (id, delta) => {
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (!item) return state;
          if (item.qty + delta <= 0) {
            return { items: state.items.filter((i) => i.id !== id) };
          }
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, qty: i.qty + delta } : i,
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      totalCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      totalSum: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { name: 'cart-storage' },
  ),
);
