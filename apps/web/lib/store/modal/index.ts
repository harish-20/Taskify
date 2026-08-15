import { create } from 'zustand';

import { modalActions } from './actions';
import { ModalState, ModalStore } from './types';

const initialState: ModalState = {
  type: null,
  props: {},
};

const useModalStore = create<ModalStore>((set, get, store) => ({
  ...initialState,
  ...modalActions(set, get, store),
}));

export default useModalStore;
