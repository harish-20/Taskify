"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

import stepComponent from "./Steps/Index";
import useOranization from "@/lib/store/organization";
import Button from "@/components/UI/Button";

interface OrganizationFormProps {}

const OrganizationForm: React.FC<OrganizationFormProps> = () => {
  const { currentStep, setCurrentStep } = useOranization();
  const prevStep = useRef<number>(-1);
  const CurrentStepComponent = stepComponent[currentStep];

  useEffect(() => {
    prevStep.current = currentStep;
  }, [currentStep]);

  const isIntialEntry = prevStep.current === -1;

  const isFormForward = prevStep.current < currentStep;

  const handleForward = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  if (CurrentStepComponent)
    return (
      <div className="flex flex-col py-8 w-8/10 lg:w-5/10">
        <AnimatePresence>
          <motion.div
            className="w-full"
            initial={{
              x: 0,
              y: isIntialEntry ? 100 : 0,
              opacity: isIntialEntry ? 0 : 100,
            }}
            animate={{
              y: isIntialEntry ? [300, 0] : [0],
              x: isIntialEntry ? [0, 0] : isFormForward ? [100, 0] : [-100, 0],
              opacity: isIntialEntry ? [0, 100] : [100],
            }}
          >
            <CurrentStepComponent />
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between my-10">
          <Button
            className="min-w-[160px]"
            variant="secondary-dark"
            onClick={handlePrevious}
          >
            Prev
          </Button>
          <Button
            className="min-w-[160px]"
            variant="primary"
            onClick={handleForward}
          >
            Next
          </Button>
        </div>
      </div>
    );

  return <p>Something went wrong no step component found</p>;
};

export default OrganizationForm;
