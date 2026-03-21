"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";

import stepComponent from "./Steps/Index";
import Button from "@/components/UI/Button";
import ErrorText from "@/components/UI/ErrorText";

import useOranization from "@/lib/store/organization";
interface OrganizationFormProps {}

const OrganizationForm: React.FC<OrganizationFormProps> = () => {
  const {
    currentStep,
    prevStep,
    setCurrentStep,
    validateStep,
    createOrganization,
    isLoading,
    successMessage,
    error,
  } = useOranization();
  const router = useRouter();
  const CurrentStepComponent = stepComponent[currentStep];

  useEffect(() => {
    if (successMessage) {
      router.push("/dashboard");
    }
  }, [successMessage, router]);

  const isIntialEntry = prevStep === -1;

  const isFormForward = prevStep < currentStep;

  const isCurrentStepValid = validateStep(currentStep);

  const isLastStep = currentStep === stepComponent.length - 1;

  const handleForward = () => {
    if (isCurrentStepValid) {
      if (isLastStep) {
        createOrganization();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  useEffect(() => {
    if (error && !isLastStep) {
    }
  }, [currentStep, error, isLastStep]);

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

        {error && <ErrorText className="my-4">{error}</ErrorText>}

        {isLastStep ? (
          <div className="my-10">
            <Button
              className="w-full"
              variant="primary"
              onClick={handleForward}
              disabled={!isCurrentStepValid || isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        ) : (
          <div className="flex justify-between my-10">
            <Button
              className="md:min-w-[160px]"
              variant="secondary-dark"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Prev
            </Button>
            <Button
              className="md:min-w-[160px]"
              variant="primary"
              onClick={handleForward}
              disabled={!isCurrentStepValid || isLoading}
            >
              {isLoading ? "Submitting..." : "Next"}
            </Button>
          </div>
        )}
      </div>
    );

  return <p>Something went wrong no step component found</p>;
};

export default OrganizationForm;
