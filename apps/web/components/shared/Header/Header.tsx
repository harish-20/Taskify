import Link from 'next/link';

import NavToggler from './NavToggler';

import Avatar from '@/components/UI/Avatar';
import { useAuthStore } from '@/lib/providers/auth-store-provider';

interface HeaderProps {
  isNavOpen: boolean;
  toggleNav: () => void;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { isNavOpen, toggleNav } = props;
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex items-center justify-between h-[60px] px-4 border-b border-b-gray">
      <NavToggler isNavOpen={isNavOpen} toggleNav={toggleNav} />

      <Link href="/profile" className="ml-4">
        <Avatar name={user?.name} className="ml-auto" size="sm" />
      </Link>
    </header>
  );
};
export default Header;
