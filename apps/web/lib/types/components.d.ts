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

export type Link = {
  id: number;
  label: string;
  link: string;
  Icon: React.FC<NavlinkComponent>;
};
