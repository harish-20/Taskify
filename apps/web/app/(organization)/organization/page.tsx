"use client";
import { useState } from "react";

import { test_steps } from "@/lib/test_data";

import Stepper from "./components/Stepper/Stepper";
import OrganizationForm from "./components/OrganizationForm/OrganizationForm";

const page = () => {
  const [activeStep, setActiveStep] = useState(0);
  return (
    <>
      <Stepper
        steps={test_steps}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />

      <OrganizationForm />
    </>
  );
};
export default page;
