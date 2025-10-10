import { StateCreator } from "zustand";

import { ModalActions, ModalStore } from "./types";

export const modalActions: StateCreator<ModalStore, [], [], ModalActions> = (
  set
) => ({
  openModal: (type) => {
    set({ type });
  },
  closeModal: () => {
    set({ type: null });
  },
});
