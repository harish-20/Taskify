export type AvailableModals =
  | 'confirm'
  | 'add-task'
  | 'task-preview'
  | 'invite-member'
  | 'create-team'
  | 'create-board';

export interface ModalState {
  type: AvailableModals | null;
  props: Record<any, any>;
}

export interface ModalActions {
  openModal: (type: AvailableModals, props?: ModalState['props']) => void;
  closeModal: () => void;
}

export interface ModalStore extends ModalState, ModalActions {}
