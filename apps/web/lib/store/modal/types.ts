export type AvailableModals = 'confirm' | 'add-task' | 'task-preview';

export interface ModalState {
  type: AvailableModals | null;
  props: Record<any, any>;
}

export interface ModalActions {
  openModal: (type: AvailableModals, props?: ModalState['props']) => void;
  closeModal: () => void;
}

export interface ModalStore extends ModalState, ModalActions {}
