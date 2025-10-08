import { motion } from "motion/react";

import Email from "@/components/icons/Email";

const SignupDone = () => {
  return (
    <div className="min-h-[100px] p-6 rounded-2xl flex flex-col justify-center items-center gap-6">
      <motion.div
        className="h-30 w-30 rounded-full flex items-center justify-center"
        animate={{ translateY: [40, 0], opacity: [0, 1] }}
        transition={{ type: "spring" }}
      >
        <Email
          animate={{ pathLength: [0, 1], opacity: [0, 1] }}
          transition={{ delay: 0.3 }}
          className="text-primary"
        />
      </motion.div>

      <motion.div
        className="text-xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1], translateY: [10, 0] }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-gray-700">Verification email has been sent</p>
        <p className="text-gray-500 text-sm mt-2">
          Please click the link that we sent to continue
        </p>
      </motion.div>
    </div>
  );
};
export default SignupDone;
