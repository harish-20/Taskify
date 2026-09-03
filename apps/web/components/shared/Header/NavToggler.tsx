import DoubleArrow from '@/components/icons/DoubleArrow';
import useBreakPoints from '@/lib/hooks/useBreakpoints';

interface NavTogglerProps {
  toggleNav: () => void;
  isNavOpen: boolean;
}

const NavToggler: React.FC<NavTogglerProps> = (props) => {
  const { isNavOpen, toggleNav } = props;
  const { isDesktop } = useBreakPoints();

  return (
    <button
      className="rounded-lg hover:bg-gray border-2 border-transparent text-dark-gray cursor-pointer active:border-dark-gray"
      onClick={toggleNav}
    >
      <DoubleArrow
        className="h-8 w-8 p-1"
        initial={{ rotate: isDesktop ? '180deg' : '0deg' }}
        animate={{ rotate: isNavOpen ? '180deg' : '0deg' }}
      />
    </button>
  );
};
export default NavToggler;
