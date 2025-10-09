import { motion, TargetAndTransition } from "motion/react";

interface DoubleArrowProps {
  className?: string;
  animate?: TargetAndTransition;
}

const DoubleArrow: React.FC<DoubleArrowProps> = (props) => {
  const { className = "", animate = {} } = props;

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
        d="M18 17L13 12L18 7M11 17L6 12L11 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default DoubleArrow;
