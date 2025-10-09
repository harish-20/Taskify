"use client";

import { motion } from "motion/react";

interface GraphProps extends NavlinkComponent {}

const Graph: React.FC<GraphProps> = (props) => {
  const { className = "", isActive } = props;

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial={{ scale: 1 }}
      animate={isActive ? { scale: 1.1 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <path
        d="M4 5V19C4 19.5523 4.44772 20 5 20H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <motion.path
        d="M7 15L10.5 11.5L13 14L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: 1, pathOffset: 0 }}
        animate={isActive ? { pathLength: [0, 1] } : {}}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}
      />

      {/* Optional pulse at end */}
      {isActive && (
        <motion.circle
          cx="18"
          cy="9"
          r="3"
          fill="currentColor"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.3, 1], opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.8 }}
        />
      )}
    </motion.svg>
  );
};

export default Graph;
