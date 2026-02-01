import { create } from "zustand";
import { OrganizationStore } from "./types";
import { defaultState } from "./state";
import { organizationActions } from "./actions";
import { OrganizationAsyncActions } from "./asyncActions";

const useOranization = create<OrganizationStore>((set, get, store) => ({
  ...defaultState,
  ...organizationActions(set, get, store),
  ...OrganizationAsyncActions(set, get, store),
}));

export default useOranization;
