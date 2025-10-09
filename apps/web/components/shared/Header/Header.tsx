import NavToggler from "./NavToggler";

interface HeaderProps {
  isNavOpen: boolean;
  toggleNav: () => void;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { isNavOpen, toggleNav } = props;

  return (
    <header className="flex items-center h-[60px] px-4 border-b border-b-gray">
      <NavToggler isNavOpen={isNavOpen} toggleNav={toggleNav} />
    </header>
  );
};
export default Header;
