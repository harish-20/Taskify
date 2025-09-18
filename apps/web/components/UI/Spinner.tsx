"use client";

import { motion } from "motion/react";

const Spinner = () => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      }}
      className="h-5 w-5 border-2 border-current border-t-transparent rounded-full"
      role="status"
      aria-label="loading"
    />
  );
};

export default Spinner;
