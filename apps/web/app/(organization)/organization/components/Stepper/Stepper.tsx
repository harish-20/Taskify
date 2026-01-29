import { Dispatch, SetStateAction } from "react";

import Step from "./Step";

interface StepperProps {
  steps: Step[];
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

const Stepper: React.FC<StepperProps> = (props) => {
  const { steps, activeStep, setActiveStep } = props;
  return (
    <div className="flex items-center justify-center">
      <div className="p-2 shadow-md border-light-gray border-2 rounded-3xl flex items-center justify-center">
        {steps.map((step, index) => (
          <Step
            key={step.label}
            Icon={step.Icon}
            label={step.label}
            step={index + 1}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            totalSteps={steps.length}
          />
        ))}
      </div>
    </div>
  );
};

export default Stepper;
