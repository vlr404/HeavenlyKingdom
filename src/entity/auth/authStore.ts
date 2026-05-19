import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'USER' | 'ADMIN' | 'PRIEST';

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export function roleFromNumber(n: number): UserRole {
  if (n === 2) return 'ADMIN';
  if (n === 1) return 'PRIEST';
  return 'USER';
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (data) =>
        set((state) => {
          if (!state.user) return { user: null };
          return { user: { ...state.user, ...data } };
        }),
    }),
    { name: 'auth-storage' }
  )
);
