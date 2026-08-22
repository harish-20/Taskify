import Plus from '../../../../components/icons/Plus';
import Button from '../../../../components/UI/Button';

import Subtitle from '@/components/UI/SubTitle';
import Title from '@/components/UI/Title';
import useModalStore from '@/lib/store/modal';

interface HeadSectionProps {}

const HeadSection: React.FC<HeadSectionProps> = () => {
  const openModal = useModalStore((state) => state.openModal);

  const handleCreateTask = () => {
    openModal('add-task');
  };
  return (
    <div className="flex justify-between items-end">
      <div>
        <Title>Task Board</Title>
        <Subtitle>Manage your tasks efficiently</Subtitle>
      </div>

      <Button className="flex items-center" variant="primary" onClick={handleCreateTask}>
        Create Task
        <Plus className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default HeadSection;
