import { User } from "@/lib/types";

export interface AuthState {
  user: User | null;
  signinError: string | null;
  signupError: string | null;
  isSigningIn: boolean;
  isSigningUp: boolean;
  isSignupDone: boolean;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  clearErrors: () => void;
}

export interface AuthAsyncActions {
  signinWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
}

export interface AuthStore extends AuthState, AuthActions, AuthAsyncActions {}
