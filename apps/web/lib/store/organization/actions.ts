import { StateCreator } from "zustand";
import { OrganizationStore, OrganizationActions } from "./types";

export const organizationActions: StateCreator<
  OrganizationStore,
  [],
  [],
  OrganizationActions
> = (set, get) => ({
  setField: (key, value) => {
    set({
      formData: {
        ...get().formData,
        [key]: value,
      },
    });
  },
  setCurrentStep: (step) =>
    set({
      currentStep: step,
      prevStep: step !== get().currentStep ? get().currentStep : get().prevStep,
    }),
  validateStep: (step) => {
    const { formData } = get();
    switch (step) {
      case 0: // Organization Details
        return !!(
          formData.name.trim() &&
          formData.industry.trim() &&
          formData.size
        );
      case 1: // Contact Details
        return !!(
          formData.contactEmail.trim() &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail) &&
          formData.website.trim() &&
          /^https?:\/\/.+/.test(formData.website)
        );
      case 2: // Location & Address
        return !!(
          formData.address.state.trim() && formData.address.country.trim()
        );
      case 3: // Technology & Interests
        return formData.techStack.length > 0 && formData.interests.length > 0;
      case 4: // Review & Confirm
        return true; // No validation needed for review step
      default:
        return false;
    }
  },
});
