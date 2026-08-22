import Subtitle from '@/components/UI/SubTitle';
import Title from '@/components/UI/Title';

interface HeadSectionProps {}

const HeadSection: React.FC<HeadSectionProps> = (props) => {
  const {} = props;

  return (
    <div className="flex flex-col gap-1">
      <Title>Task Board</Title>
      <Subtitle>Manage your tasks efficiently</Subtitle>
    </div>
  );
};

export default HeadSection;
