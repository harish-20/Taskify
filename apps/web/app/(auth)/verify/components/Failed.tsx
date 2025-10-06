import Cross from "@/components/icons/Cross";
import { motion } from "motion/react";

const Failed = () => {
  return (
    <div className="flex items-center justify-center mt-20">
      <div className="bg-white border border-gray-300 shadow-2xl min-h-[300px] min-w-lg rounded-2xl flex flex-col justify-center items-center gap-6">
        <motion.div
          className="h-30 w-30 rounded-full bg-white border-2 border-red-500 flex justify-center"
          animate={{ translateY: [40, 0], opacity: [0, 1] }}
          transition={{ type: "spring" }}
        >
          <Cross
            animate={{ pathLength: [0, 1], opacity: [0, 1] }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-red-500 mt-2"
          />
        </motion.div>

        <motion.div
          className="text-xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1], translateY: [10, 0] }}
          transition={{ delay: 0.4 }}
        >
          Verification Failed
          <p className="text-sm text-gray-700">
            Please contact our support team for assistance
          </p>
        </motion.div>
      </div>
    </div>
  );
};
export default Failed;
