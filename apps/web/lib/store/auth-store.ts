import { User } from "@/lib/types";

import { createStore } from "zustand/vanilla";
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

const defaultState: AuthState = {
  accessToken: null,
  user: null,
};

const createAuthStore = (initialState: AuthState = defaultState) =>
  createStore<AuthStore>()(
    persist(
      (set) => ({
        ...initialState,

        setAccessToken: (token) => set({ accessToken: token }),
        setUser: (user) => set({ user }),
        clearAuth: () => set({ accessToken: null, user: null }),
      }),
      { name: "auth-storage" }
    )
  );

export default createAuthStore;
