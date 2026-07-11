export interface NavlinkComponent {
  isActive: boolean;
  className: string;
}

export interface ModalProps {
  onClose: () => void;
}

export interface SelectOption {
  label: string;
  value: string;
}
