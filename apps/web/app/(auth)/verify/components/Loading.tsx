import { motion } from "motion/react";

import Spinner from "@/components/UI/Spinner";

const Loading = () => {
  return (
    <div className="flex items-center justify-center mt-20">
      <div className="bg-white border border-gray-300 shadow-2xl min-h-[300px] min-w-lg rounded-2xl flex flex-col justify-center items-center gap-6">
        <motion.div
          className="h-30 w-30 rounded-full flex items-center justify-center"
          animate={{ translateY: [40, 0], opacity: [0, 1] }}
          transition={{ type: "spring" }}
        >
          <Spinner size="lg" className="text-primary" />
        </motion.div>

        <motion.div
          className="text-xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1], translateY: [10, 0] }}
          transition={{ delay: 0.4 }}
        >
          Verification Processing...
          <p className="text-sm text-gray-700">
            Verifying your invitation link to onboard you to Taskify
          </p>
        </motion.div>
      </div>
    </div>
  );
};
export default Loading;
