import { useState } from 'react';

import Button from '../UI/Button';

import BaseModal from './BaseModal';

import type { ModalProps } from '@/lib/types/components';

interface ConfirmModalProps extends ModalProps {
  onConfirm: (checked: boolean) => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  checkboxLabel?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = (props) => {
  const {
    onClose,
    onConfirm,
    title = 'Confirm',
    message = 'Are you sure you want to continue?',
    confirmLabel = 'Confirm',
    checkboxLabel,
  } = props;
  const [isChecked, setIsChecked] = useState(false);

  const handleConfirm = () => {
    onConfirm(isChecked);
    onClose();
  };

  return (
    <BaseModal onClose={onClose}>
      <div className="bg-white rounded-lg min-w-md">
        <h2 className="text-xl p-4 text-center">{title}</h2>
        <hr className="text-gray-400" />

        <div className="p-4 min-h-[160px] flex flex-col justify-between">
          <p>{message}</p>

          {checkboxLabel && (
            <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(event) => setIsChecked(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              {checkboxLabel}
            </label>
          )}

          <div className="mt-6 flex gap-4 justify-center">
            <Button size="md" variant="secondary-dark" onClick={onClose}>
              Cancel
            </Button>
            <Button size="md" onClick={handleConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};
export default ConfirmModal;
