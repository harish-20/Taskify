import Plus from '../../../../components/icons/Plus';

interface ColumnHeaderProps {
  status: string;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onAddClick?: () => void;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = (props) => {
  const { status, label, Icon, onAddClick } = props;

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between rounded-xl border border-slate-200 bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2 text-slate-700">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
          <Icon className="h-4 w-4" />
        </div>
        <span className="capitalize text-sm font-semibold tracking-tight text-slate-900">
          {label}
        </span>
      </div>

      <button
        type="button"
        onClick={onAddClick}
        aria-label={`Add task to ${status}`}
        className="cursor-pointer rounded-lg p-2 text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900"
      >
        <Plus className="h-4 w-4 stroke-2" />
      </button>
    </div>
  );
};

export default ColumnHeader;
