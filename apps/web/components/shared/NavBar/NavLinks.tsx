import { links } from './links';
import type { NavlinkComponent } from '@/lib/types/components';

import NavLink from './NavLink';

const NavLinks = () => {
  return (
    <div className="mt-10 flex flex-col gap-2">
      {links.map((link) => (
        <NavLink key={link.id} label={link.label} link={link.link} Icon={link.Icon} />
      ))}
    </div>
  );
};
export default NavLinks;
