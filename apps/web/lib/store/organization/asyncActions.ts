import { StateCreator } from "zustand";
import {
  OrganizationAsyncActions as AsyncActions,
  OrganizationStore,
} from "./types";

export const OrganizationAsyncActions: StateCreator<
  OrganizationStore,
  [],
  [],
  AsyncActions
> = (set, get) => ({
  createOrganization: async () => {},
});
