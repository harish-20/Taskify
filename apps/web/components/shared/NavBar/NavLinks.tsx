import Home from "@/components/icons/Home";
import Graph from "@/components/icons/Graph";

import NavLink from "./NavLink";

const links = [
  {
    id: 1,
    label: "Home",
    link: "/home",
    Icon: Home,
  },
  {
    id: 2,
    label: "Dashboard",
    link: "/dashboard",
    Icon: Graph,
  },
];

const NavLinks = () => {
  return (
    <div className="mt-10 flex flex-col gap-2">
      {links.map((link) => (
        <NavLink
          key={link.id}
          label={link.label}
          link={link.link}
          Icon={link.Icon}
        />
      ))}
    </div>
  );
};
export default NavLinks;
