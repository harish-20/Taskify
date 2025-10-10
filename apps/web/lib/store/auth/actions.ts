import { StateCreator } from "zustand";
import { AuthActions, AuthStore } from "./types";

export const authActions: StateCreator<AuthStore, [], [], AuthActions> = (
  set
) => ({
  setUser: (user) => set({ user }),
  clearAuth: () => set({ user: null }),
  clearErrors: () => set({ signinError: null, signupError: null }),
});
