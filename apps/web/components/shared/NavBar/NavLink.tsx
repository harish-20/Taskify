import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  label: string;
  link: string;
  Icon: React.FC<NavlinkComponent>;
}

const NavLink: React.FC<NavLinkProps> = (props) => {
  const { label, link, Icon } = props;

  const path = usePathname();
  const isActive = path.includes(link);

  return (
    <Link
      className={`flex gap-2 items-center py-2 px-3 rounded-lg font-medium transition-colors duration-200  ${isActive ? "bg-gray-200 text-black" : "text-dark-gray hover:bg-gray hover:text-gray-800"}`}
      href={link}
    >
      <Icon className="h-4 w-4" isActive={isActive} />
      <span className="">{label}</span>
    </Link>
  );
};
export default NavLink;
