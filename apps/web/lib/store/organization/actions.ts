import { StateCreator } from "zustand";
import { OrganizationStore, OrganizationActions } from "./types";

export const organizationActions: StateCreator<
  OrganizationStore,
  [],
  [],
  OrganizationActions
> = (set, get) => ({
  setField: (key, value) => {
    set({
      formData: {
        ...get().formData,
        [key]: value,
      },
    });
  },
});
