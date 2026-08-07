import { StateCreator } from 'zustand';

import { ModalActions, ModalStore } from './types';

export const modalActions: StateCreator<ModalStore, [], [], ModalActions> = (set) => ({
  openModal: (type, props = {}) => {
    set({ type, props });
  },
  closeModal: () => {
    set({ type: null, props: {} });
  },
});
