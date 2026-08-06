import { SquarePen, X } from 'lucide-react';

import BaseModal from '../BaseModal';

import AddTaskForm from './AddTaskForm';

import Button from '@/components/UI/Button';
import { ModalProps } from '@/lib/types';

interface AddTaskModalProps extends ModalProps {}

const AddTaskModal: React.FC<AddTaskModalProps> = (props) => {
  const { onClose } = props;

  return (
    <BaseModal onClose={onClose}>
      <div className="flex w-[min(96vw,68rem)] max-h-[92vh] flex-col overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
              <SquarePen size={18} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Create Task</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white [scrollbar-gutter:stable]">
          <AddTaskForm onClose={onClose} />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-5 py-4 lg:px-6">
          <Button type="button" variant="secondary-dark" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="create-task-form">
            Create Task
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default AddTaskModal;
