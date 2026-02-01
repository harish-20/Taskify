"use client";

import useOranization from "@/lib/store/organization";

import Step from "./Step";

interface StepperProps {}

const Stepper: React.FC<StepperProps> = (props) => {
  const { currentStep, steps, setCurrentStep } = useOranization();
  return (
    <div className="flex items-center justify-center">
      <div className="p-2 shadow-md border-light-gray border-2 rounded-3xl flex items-center justify-center">
        {steps.map((step, index) => (
          <Step
            key={step.label}
            Icon={step.Icon}
            label={step.label}
            step={index}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            totalSteps={steps.length}
          />
        ))}
      </div>
    </div>
  );
};

export default Stepper;
