import { FC, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Tooltip from "@/components/UI/Tooltip";
import { Step as StepType } from "@/lib/types/organization";
import useOranization from "@/lib/store/organization";

interface StepProps extends StepType {
  label: string;
  Icon: FC<any>;
  step: number;
  totalSteps: number;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const Step: React.FC<StepProps> = ({
  label,
  Icon,
  step,
  totalSteps,
  currentStep,
  setCurrentStep,
}) => {
  const { validateStep } = useOranization();
  const isActive = step === currentStep;

  const isStepAccessible = () => {
    if (step <= currentStep) return true;
    if (step === currentStep + 1) return validateStep(currentStep);

    for (let i = 0; i < step; i++) {
      if (!validateStep(i)) return false;
    }
    return validateStep(step);
  };

  const canNavigate = isStepAccessible();

  const measureRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  useLayoutEffect(() => {
    if (measureRef.current) {
      setContentWidth(measureRef.current.scrollWidth);
    }
  }, [label]);

  return (
    <div className="flex group">
      <button
        className={`py-2 px-3 flex gap-2 transition-opacity duration-300 ${
          canNavigate ? "cursor-pointer" : "cursor-not-allowed opacity-50"
        }`}
        onClick={() => canNavigate && setCurrentStep(step)}
        disabled={!canNavigate}
      >
        <Tooltip content={isActive ? "" : label}>
          <div
            className={`flex items-center justify-center w-12 aspect-square rounded-full transition-colors duration-300 delay-150 ${
              isActive
                ? "bg-primary text-white"
                : canNavigate
                  ? "text-dark-gray hover:bg-gray-100"
                  : "text-gray-400"
            }`}
          >
            <Icon />
          </div>
        </Tooltip>

        <AnimatePresence initial={false}>
          {isActive && (
            <motion.div
              key="step-label"
              className="overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: contentWidth }}
              exit={{ width: 0 }}
            >
              <div className="flex flex-col gap-1 pr-3 text-left">
                <div className="text-xs font-semibold text-dark-gray whitespace-nowrap">
                  Step {step + 1}/{totalSteps}
                </div>
                <div className="text-sm font-semibold whitespace-nowrap">
                  {label}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* divider */}
      <div className="border my-2 border-gray rounded-lg group-last:hidden" />

      {/* Hidden measurement container */}
      <div
        ref={measureRef}
        className="absolute invisible h-1 whitespace-nowrap"
      >
        <div className="flex flex-col gap-1 pr-3">
          <div className="text-xs font-semibold">
            Step {step}/{totalSteps}
          </div>
          <div className="text-sm font-semibold">{label}</div>
        </div>
      </div>
    </div>
  );
};

export default Step;
