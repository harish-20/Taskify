import Subtitle from '@/components/UI/SubTitle';
import Title from '@/components/UI/Title';

interface HeadSectionProps {}

const HeadSection: React.FC<HeadSectionProps> = (props) => {
  const {} = props;

  return (
    <div className="flex flex-col gap-1">
      <Title>Profile settings</Title>
      <Subtitle>Keep your personal information up to date</Subtitle>
    </div>
  );
};

export default HeadSection;
