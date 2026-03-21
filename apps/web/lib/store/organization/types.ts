import { CompanySize, Step } from "@/lib/types/organization";
import { Address } from "@/components/UI/AddressInput";

export interface OrganizationForm {
  name: string;
  description: string;
  address: Address;
  contactEmail: string;
  phoneNumber: string;
  website: string;
  industry: string;
  size: CompanySize | "";
  interests: string[];
  techStack: string[];
}

export interface OrganizationState {
  formData: OrganizationForm;
  steps: Step[];
  prevStep: number;
  currentStep: number;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface OrganizationActions {
  setField: <K extends keyof OrganizationForm>(
    key: K,
    value: OrganizationForm[K],
  ) => void;
  setCurrentStep: (step: number) => void;
  validateStep: (step: number) => boolean;
}

export interface OrganizationAsyncActions {
  createOrganization: () => Promise<void>;
}

export interface OrganizationStore
  extends OrganizationState,
    OrganizationActions,
    OrganizationAsyncActions {}
