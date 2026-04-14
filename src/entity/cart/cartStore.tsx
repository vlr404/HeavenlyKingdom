import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── ТИПЫ ──
interface Product {
  id: number
  name: string
  price: number
  cat: string
  img: string
  isNew: boolean
}

export interface CartItem extends Product {
  qty: number
}

export interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (id: number) => void
  changeQty: (id: number, delta: number) => void
  clearCart: () => void
  totalCount: () => number
  totalSum: () => number
}

// ── СТОР ──
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Добавить товар — если уже есть увеличивает qty
      addItem: (product) => {
        set(state => {
          const existing = state.items.find(i => i.id === product.id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === product.id ? { ...i, qty: i.qty + 1 } : i
              )
            }
          }
          return { items: [...state.items, { ...product, qty: 1 }] }
        })
      },

      // Удалить товар полностью
      removeItem: (id) => {
        set(state => ({ items: state.items.filter(i => i.id !== id) }))
      },

      // Изменить количество — если qty становится 0 удаляет товар
      changeQty: (id, delta) => {
        set(state => {
          const item = state.items.find(i => i.id === id)
          if (!item) return state
          if (item.qty + delta <= 0) {
            return { items: state.items.filter(i => i.id !== id) }
          }
          return {
            items: state.items.map(i =>
              i.id === id ? { ...i, qty: i.qty + delta } : i
            )
          }
        })
      },

      // Очистить корзину
      clearCart: () => set({ items: [] }),

      // Общее количество товаров
      totalCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      // Общая сумма
      totalSum: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    {
      name: 'cart-storage', // ключ в localStorage
    }
  )
)