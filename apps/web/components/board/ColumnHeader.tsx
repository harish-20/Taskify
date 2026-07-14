import Plus from '../icons/Plus';

interface ColumnHeaderProps {
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onAddClick?: () => void;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = (props) => {
  const { label, Icon, onAddClick } = props;

  return (
    <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" />
        <span className="capitalize font-medium">{label}</span>
      </div>

      <div
        onClick={onAddClick}
        className="p-2 rounded-md cursor-pointer transition-colors duration-300 hover:bg-gray-200"
      >
        <Plus className="w-5 h-5 stroke-2" />
      </div>
    </div>
  );
};

export default ColumnHeader;
