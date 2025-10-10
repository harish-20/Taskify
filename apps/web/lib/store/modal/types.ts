export type AvailableModals = "confirm";

export interface ModalState {
  type: AvailableModals | null;
}

export interface ModalActions {
  openModal: (type: AvailableModals) => void;
  closeModal: () => void;
}

export interface ModalStore extends ModalState, ModalActions {}
