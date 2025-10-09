"use client";

import { PropsWithChildren, useEffect, useState } from "react";

import useBreakPoints from "@/lib/hooks/useBreakpoints";

import NavBar from "@/components/shared/NavBar/NavBar";
import Header from "@/components/shared/Header/Header";

interface AppLayoutProps extends PropsWithChildren {}

const AppLayout: React.FC<AppLayoutProps> = (props) => {
  const { children } = props;

  const { isDesktop } = useBreakPoints();
  const [isNavOpen, setIsNavOpen] = useState(isDesktop);

  useEffect(() => {
    setIsNavOpen(isDesktop);
  }, [isDesktop]);

  return (
    <div className="flex">
      <NavBar isNavOpen={isNavOpen} closeNav={() => setIsNavOpen(false)} />
      <div className="flex-1">
        <Header
          isNavOpen={isNavOpen}
          toggleNav={() => setIsNavOpen((prev) => !prev)}
        />
        {children}
      </div>
    </div>
  );
};
export default AppLayout;
