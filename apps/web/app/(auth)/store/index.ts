import { User } from "@/lib/types";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
}

export interface AuthActions {
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

export interface AuthStore extends AuthState, AuthActions {}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,

      setAccessToken: (token) => set({ accessToken: token }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ accessToken: null, user: null }),
    }),
    { name: "auth-storage" }
  )
);
