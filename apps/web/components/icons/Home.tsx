"use client";

import { motion } from "motion/react";

interface HomeProps extends NavlinkComponent {}

const Home: React.FC<HomeProps> = (props) => {
  const { className = "", isActive } = props;

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="100px"
      height="100px"
      viewBox="0 0 21 21"
      version="1.1"
      className={className}
      animate={
        isActive
          ? {
              scale: [1, 1.1, 1],
              rotate: [0, -6, 3, -2, 3, -3, 2, 5, 0],
            }
          : {}
      }
      transition={{
        duration: 0.5,
      }}
    >
      <defs></defs>
      <g
        id="Page-1"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Dribbble-Light-Preview"
          transform="translate(-419.000000, -720.000000)"
          fill="currentColor"
        >
          <g id="icons" transform="translate(56.000000, 160.000000)">
            <path
              d="M379.79996,578 L376.649968,578 L376.649968,574 L370.349983,574 L370.349983,578 L367.19999,578 L367.19999,568.813 L373.489475,562.823 L379.79996,568.832 L379.79996,578 Z M381.899955,568.004 L381.899955,568 L381.899955,568 L373.502075,560 L363,569.992 L364.481546,571.406 L365.099995,570.813 L365.099995,580 L372.449978,580 L372.449978,576 L374.549973,576 L374.549973,580 L381.899955,580 L381.899955,579.997 L381.899955,570.832 L382.514204,571.416 L384.001,570.002 L381.899955,568.004 Z"
              id="home-[currentColor]"
            />
          </g>
        </g>
      </g>
    </motion.svg>
  );
};

export default Home;
