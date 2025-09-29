import Image from "next/image";

const FullLogo = () => {
  return (
    <Image
      className="h-12 w-auto"
      priority
      src="./taskify-logo-full.svg"
      alt="logo"
      height={50}
      width={120}
    />
  );
};
export default FullLogo;
