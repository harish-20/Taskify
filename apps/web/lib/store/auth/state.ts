import { AuthState } from "./types";

export const defaultState: AuthState = {
  user: null,
  signinError: null,
  signupError: null,
  isSigningIn: false,
  isSigningUp: false,
  isSignupDone: false,
};
