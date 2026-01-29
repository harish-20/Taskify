import { Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion } from "motion/react";
import Tooltip from "@/components/UI/Tooltip";

interface StepProps extends Step {
  step: number;
  totalSteps: number;
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

const Step: React.FC<StepProps> = (props) => {
  const { label, Icon, step, totalSteps, activeStep, setActiveStep } = props;
  const isActive = step === activeStep;
  return (
    <div className="flex group">
      <button
        className="p-2 flex gap-2 cursor-pointer"
        onClick={() => setActiveStep(step)}
      >
        <Tooltip content={isActive ? "" : label}>
          <div
            className={`flex items-center justify-center w-12 aspect-square rounded-full transition-colors duration-300 delay-150 ${isActive ? "bg-primary text-white" : "text-dark-gray"}`}
          >
            <Icon />
          </div>
        </Tooltip>

        <AnimatePresence>
          {isActive && (
            <motion.div
              key="step-label"
              className="overflow-x-hidden"
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              exit={{ width: 0 }}
            >
              <div className="w-[120px] text-left flex flex-col gap-1">
                <div className="text-xs font-semibold text-dark-gray">
                  Step {step}/{totalSteps}
                </div>
                <div>{label}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* divider */}
      <div className="border my-2 border-gray rounded-lg group-last:hidden" />
    </div>
  );
};

export default Step;
