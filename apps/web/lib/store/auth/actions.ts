import { StateCreator } from "zustand";
import { AuthStore } from "./types";

export const authActions: StateCreator<
  AuthStore,
  [],
  [],
  Partial<AuthStore>
> = (set) => ({
  setUser: (user) => set({ user }),
  clearAuth: () => set({ user: null }),
  clearErrors: () => set({ signinError: null, signupError: null }),
});
