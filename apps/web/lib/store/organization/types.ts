export type CompanySize =
  | "0-20"
  | "20-50"
  | "50-100"
  | "100-200"
  | "200-500"
  | "500-1000"
  | "1000-2000"
  | "2000+";

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
  currentStep: number;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface OrganizationActions {
  setField: <K extends keyof OrganizationForm>(
    key: K,
    value: OrganizationForm[K]
  ) => void;
}

export interface OrganizationAsyncActions {
  createOrganization: () => Promise<void>;
}

export interface OrganizationStore
  extends OrganizationState,
    OrganizationActions,
    OrganizationAsyncActions {}
