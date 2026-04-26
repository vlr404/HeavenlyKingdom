import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../../types';

interface FavoritesStore {
  ids: Set<number>;
  toggle: (product: Product) => void;
  isFavorite: (id: number) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      ids: new Set<number>(),

      toggle: (product) => {
        set((state) => {
          const next = new Set(state.ids);
          if (next.has(product.id)) {
            next.delete(product.id);
          } else {
            next.add(product.id);
          }
          return { ids: next };
        });
      },

      isFavorite: (id) => get().ids.has(id),
    }),
    {
      name: 'favorites-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          parsed.state.ids = new Set(parsed.state.ids ?? []);
          return parsed;
        },
        setItem: (name, value) => {
          const copy = {
            ...value,
            state: {
              ...value.state,
              ids: Array.from((value.state as FavoritesStore).ids),
            },
          };
          localStorage.setItem(name, JSON.stringify(copy));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
