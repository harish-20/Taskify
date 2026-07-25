import { createStore } from "zustand/vanilla";

import { authActions } from "./actions";
import { authAsyncActions } from "./asyncActions";
import { defaultState } from "./state";
import { AuthStore } from "./types";

const createAuthStore = (initialState = defaultState) =>
  createStore<AuthStore>()((set, get, store) => ({
    ...initialState,
    ...authActions(set, get, store),
    ...authAsyncActions(set, get, store),
  }));

export type { AuthStore };

export default createAuthStore;
