import { create } from "zustand";

import { ModalState, ModalStore } from "./types";
import { modalActions } from "./actions";

const initialState: ModalState = {
  type: null,
  props: {},
};

const useModalStore = create<ModalStore>((set, get, store) => ({
  ...initialState,
  ...modalActions(set, get, store),
}));

export default useModalStore;
