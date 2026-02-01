interface NavlinkComponent {
  isActive: boolean;
  className: string;
}

interface ModalProps {
  onClose: () => void;
}

export interface SelectOption {
  label: string;
  value: string;
}
