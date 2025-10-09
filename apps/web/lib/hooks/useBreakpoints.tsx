"use client";

import { useEffect, useState } from "react";

const useBreakPoints = (breakpoint = 768, delay = 200) => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    setIsDesktop(
      typeof window !== "undefined" ? window.innerWidth >= breakpoint : false
    );
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleResize = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        setIsDesktop(window.innerWidth >= breakpoint);
        timeoutId = null;
      }, delay);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [breakpoint, delay]);

  return {
    isDesktop,
    isMobile: !isDesktop,
  };
};

export default useBreakPoints;
