import { PropsWithChildren } from "react";

import ShortLogo from "@/components/logos/ShortLogo";

interface OrganizationLayoutProps extends PropsWithChildren {}

const OrganizationLayout: React.FC<OrganizationLayoutProps> = ({
  children,
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center my-8">
        <ShortLogo />
      </div>
      {children}
    </div>
  );
};

export default OrganizationLayout;
