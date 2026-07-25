import { create } from "zustand";

import { organizationActions } from "./actions";
import { OrganizationAsyncActions } from "./asyncActions";
import { defaultState } from "./state";
import { OrganizationStore } from "./types";

const useOranization = create<OrganizationStore>((set, get, store) => ({
  ...defaultState,
  ...organizationActions(set, get, store),
  ...OrganizationAsyncActions(set, get, store),
}));

export default useOranization;
