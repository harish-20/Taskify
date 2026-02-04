"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

import stepComponent from "./Steps/Index";
import useOranization from "@/lib/store/organization";
import Button from "@/components/UI/Button";

interface OrganizationFormProps {}

const OrganizationForm: React.FC<OrganizationFormProps> = () => {
  const { currentStep, prevStep, setCurrentStep } = useOranization();
  const CurrentStepComponent = stepComponent[currentStep];

  const isIntialEntry = prevStep === -1;

  console.log({ currentStep, prevStep });
  const isFormForward = prevStep < currentStep;

  const handleForward = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  if (CurrentStepComponent)
    return (
      <div className="flex flex-col py-8 w-8/10 lg:w-5/10">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentStep}
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
            transition={{
              type: "keyframes",
            }}
            exit={{ opacity: [100, 0] }}
          >
            <CurrentStepComponent />
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between my-10">
          <Button
            className="md:min-w-[160px]"
            variant="secondary-dark"
            onClick={handlePrevious}
          >
            Prev
          </Button>
          <Button
            className="md:min-w-[160px]"
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
