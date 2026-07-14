import { ModalProps } from '@/lib/types';

import BaseModal from '../BaseModal';
import AddTaskForm from './AddTaskForm';
import Title from '@/components/UI/Title';

interface AddTaskModalProps extends ModalProps {}

const AddTaskModal: React.FC<AddTaskModalProps> = (props) => {
  const { onClose } = props;

  return (
    <BaseModal onClose={onClose}>
      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg min-w-xl">
        <Title>Create Task</Title>
        <AddTaskForm onClose={onClose} />
      </div>
    </BaseModal>
  );
};

export default AddTaskModal;
