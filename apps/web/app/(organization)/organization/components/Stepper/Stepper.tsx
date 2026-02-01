"use client";

import useOranization from "@/lib/store/organization";

import Step from "./Step";

interface StepperProps {}

const Stepper: React.FC<StepperProps> = (props) => {
  const { currentStep, steps, setCurrentStep } = useOranization();
  return (
    <div className="scale-50 flex items-center justify-center  md:scale-100">
      <div className="p-2 shadow-md border-gray border-1 rounded-3xl flex items-center justify-center">
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
