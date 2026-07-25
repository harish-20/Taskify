"use client";

import OrganizationForm from "./components/OrganizationForm/OrganizationForm";
import Stepper from "./components/Stepper/Stepper";

const page = () => {
  return (
    <>
      <Stepper />

      <OrganizationForm />
    </>
  );
};
export default page;
