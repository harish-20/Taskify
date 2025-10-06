"use client";

import { motion, TargetAndTransition, Transition } from "motion/react";

interface TickProps {
  className?: string;
  animate?: TargetAndTransition;
  transition?: Transition;
}

const Tick: React.FC<TickProps> = (props) => {
  const { className = "", animate = {}, transition = {} } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100px"
      height="100px"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <motion.path
        animate={animate}
        transition={transition}
        d="M4.89163 13.2687L9.16582 17.5427L18.7085 8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default Tick;
