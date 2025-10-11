"use client";

import { AnimatePresence, motion } from "motion/react";

import useBreakPoints from "@/lib/hooks/useBreakpoints";

import FullLogo from "@/components/logos/FullLogo";
import Backdrop from "@/components/UI/Backdrop";

import NavLinks from "./NavLinks";

interface NavBarProps {
  isNavOpen: boolean;
  closeNav: () => void;
}

const NavBar: React.FC<NavBarProps> = (props) => {
  const { isNavOpen, closeNav } = props;
  const { isDesktop } = useBreakPoints();

  return (
    <motion.nav
      className="flex min-h-screen relative"
      initial={{ width: isDesktop ? "250px" : "0px" }}
      animate={{ width: isDesktop ? (isNavOpen ? "250px" : "0px") : "0px" }}
    >
      <AnimatePresence>
        {isNavOpen && !isDesktop && <Backdrop onClose={closeNav} />}
      </AnimatePresence>
      <motion.div
        className="p-4 bg-light-gray h-full border-r border-r-gray w-[250px] absolute top-0 left-0"
        initial={{ translateX: isDesktop ? "0%" : "-100%" }}
        animate={{ translateX: isNavOpen ? "0%" : "-100%" }}
        transition={{ type: "keyframes" }}
      >
        <FullLogo />

        <NavLinks />
      </motion.div>
    </motion.nav>
  );
};
export default NavBar;
