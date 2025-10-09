import DoubleArrow from "@/components/icons/DoubleArrow";

interface NavTogglerProps {
  toggleNav: () => void;
  isNavOpen: boolean;
}

const NavToggler: React.FC<NavTogglerProps> = (props) => {
  const { isNavOpen, toggleNav } = props;

  const arrowAnimation = isNavOpen ? ["180deg", "0deg"] : ["0deg", "180deg"];
  return (
    <button
      className="rounded-lg hover:bg-gray border-2 border-transparent text-dark-gray active:border-dark-gray"
      onClick={toggleNav}
    >
      <DoubleArrow
        className="h-8 w-8 p-1"
        animate={{ rotate: arrowAnimation }}
      />
    </button>
  );
};
export default NavToggler;
