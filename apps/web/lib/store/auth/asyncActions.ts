import { StateCreator } from "zustand";
import { signin, signup } from "@/lib/services/api/auth";
import { customLocalStorage } from "@/lib/services/localStorage";
import { AuthStore } from "./types";

export const authAsyncActions: StateCreator<
  AuthStore,
  [],
  [],
  Partial<AuthStore>
> = (set) => ({
  signinWithEmail: async (email, password) => {
    set({ isSigningIn: true });

    try {
      const response = await signin(email, password);
      if (response.data) {
        const { accessToken, user } = response.data;
        set({ user });
        customLocalStorage.setValue("accessToken", accessToken);
      }
    } catch (err: any) {
      const message = err?.message || "Something went wrong. Please try again.";
      set({ signinError: message });
    } finally {
      set({ isSigningIn: false });
    }
  },
  signupWithEmail: async (name, email, password) => {
    set({ isSigningUp: true });

    try {
      const response = await signup(name, email, password);
      if (response.data) {
        set({ isSignupDone: true });
      }
    } catch (err: any) {
      const message = err?.message || "Something went wrong. Please try again.";
      set({ signupError: message });
    } finally {
      set({ isSigningUp: false });
    }
  },
});
