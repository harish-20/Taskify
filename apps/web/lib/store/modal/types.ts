export type AvailableModals = 'confirm' | 'add-task';

export interface ModalState {
  type: AvailableModals | null;
  props: Record<any, any>;
}

export interface ModalActions {
  openModal: (type: AvailableModals) => void;
  closeModal: () => void;
}

export interface ModalStore extends ModalState, ModalActions {}
