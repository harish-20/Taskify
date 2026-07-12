import Button from '../UI/Button';

import Plus from '../icons/Plus';

interface HeadSectionProps {}

const HeadSection: React.FC<HeadSectionProps> = () => {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-2xl font-medium">Task Board</h2>
        <p className="text-gray-600">Manage your tasks efficiently</p>
      </div>

      <Button className="flex items-center" variant="primary" onClick={() => {}}>
        Create Task
        <Plus className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default HeadSection;
