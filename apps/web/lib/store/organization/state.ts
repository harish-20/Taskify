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
  currentStep: 0,
  isLoading: false,
  error: null,
  successMessage: null,
};
