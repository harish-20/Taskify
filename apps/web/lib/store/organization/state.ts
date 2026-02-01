import { step_data } from "./config/step_data";
import { OrganizationState } from "./types";

export const defaultState: OrganizationState = {
  formData: {
    name: "",
    description: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zip: "",
    },
    contactEmail: "",
    phoneNumber: "",
    website: "",
    industry: "",
    size: "",
    interests: [],
    techStack: [],
  },
  steps: step_data,
  currentStep: 0,
  isLoading: false,
  error: null,
  successMessage: null,
};
