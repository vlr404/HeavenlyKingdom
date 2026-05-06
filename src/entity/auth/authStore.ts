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
  isAdmin?: boolean;
  role?: UserRole;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

function resolveRole(user: User): UserRole {
  if (user.email === 'priest@test.com') return 'PRIEST';
  if (user.isAdmin) return 'ADMIN';
  return 'USER';
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => {
        const role = resolveRole(user);
        set({ user: { ...user, role }, isAuthenticated: true });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (data) =>
        set((state) => {
          if (!state.user) return { user: null };
          const updated = { ...state.user, ...data };
          return { user: { ...updated, role: resolveRole(updated) } };
        }),
    }),
    { name: 'auth-storage' }
  )
);
