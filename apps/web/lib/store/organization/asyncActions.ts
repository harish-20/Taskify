import { StateCreator } from "zustand";
import {
  OrganizationAsyncActions as AsyncActions,
  OrganizationStore,
} from "./types";
import { createOrganization as createOrganizationApi } from "@/lib/services/api/organization";

export const OrganizationAsyncActions: StateCreator<
  OrganizationStore,
  [],
  [],
  AsyncActions
> = (set, get) => ({
  createOrganization: async () => {
    const { formData } = get();
    set({ isLoading: true, error: null });

    try {
      const response: { success: boolean; message: string; data: any } =
        await createOrganizationApi({
          name: formData.name,
          description: formData.description,
          address: formData.address,
          contactEmail: formData.contactEmail,
          phoneNumber: formData.phoneNumber,
          website: formData.website,
          industry: formData.industry,
          size: formData.size,
          interests: formData.interests,
          techStack: formData.techStack,
        });

      set({
        isLoading: false,
        successMessage: "Organization created successfully!",
        error: null,
      });

      // Optionally reset form or navigate to dashboard
      console.log("Organization created:", response.data);
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error?.response?.data?.message || "Failed to create organization",
        successMessage: null,
      });
    }
  },
});
