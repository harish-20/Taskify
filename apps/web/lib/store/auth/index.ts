import { createStore } from "zustand/vanilla";

import { defaultState } from "./state";
import { authActions } from "./actions";
import { authAsyncActions } from "./asyncActions";

import { AuthStore } from "./types";

const createAuthStore = (initialState = defaultState) =>
  createStore<AuthStore>()(
    (set, get, store) =>
      ({
        ...initialState,
        ...authActions(set, get, store),
        ...authAsyncActions(set, get, store),
      }) as AuthStore
  );

export type { AuthStore };

export default createAuthStore;
