import Image from "next/image";

interface ShortLogoProps {
  className?: string;
}

const ShortLogo: React.FC<ShortLogoProps> = ({ className }) => {
  return (
    <Image
      className={`h-12 w-auto ${className}`}
      priority
      src=".\taskify-logo-icon.svg"
      alt="logo"
      height={50}
      width={120}
    />
  );
};
export default ShortLogo;
