import { ErrorCode } from "@repo/shared/errors";

import { StateCreator } from "zustand";

import { signin, signup } from "@/lib/services/api/auth";
import { customLocalStorage } from "@/lib/services/localStorage";

import { AuthAsyncActions, AuthStore } from "./types";

const getErrorMessage = (code: ErrorCode) => {
  const messageMap: Partial<Record<ErrorCode, string>> = {
    INVALID_PASSWORD: "The password you entered is incorrect",
    ACCOUNT_NOT_EXISTS: "No account found for this email address",
    DIFFERENT_PROVIDER_ACCOUNT:
      "This email is linked to a different sign-in method",
    EMAIL_ALREADY_EXISTS: "An account with this email already exists",
  };

  return messageMap[code] || "Something went wrong.";
};

export const authAsyncActions: StateCreator<
  AuthStore,
  [],
  [],
  AuthAsyncActions
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
      const message = getErrorMessage(err.data.code);
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
        setTimeout(() => {
          set({ isSignupDone: false });
        }, 5000);
      }
    } catch (err: any) {
      const message = getErrorMessage(err.data.code);
      set({ signupError: message });
    } finally {
      set({ isSigningUp: false });
    }
  },
});
