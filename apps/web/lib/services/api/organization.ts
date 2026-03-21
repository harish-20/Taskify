import { ApiResponse } from "@repo/shared/types";

import Api from ".";
import pathMap from "./pathMap";

interface OrganizationResponse {
  organization: Organization;
  organizationProfile: OrganizationProfile;
}

export const createOrganization = async (organizationDetails: {
  name: string;
  description?: string;
  address: {
    street?: string;
    city?: string;
    state: string;
    country: string;
    zip?: string;
  };
  contactEmail: string;
  phoneNumber?: string;
  website?: string;
  industry: string;
  size: string;
  interests: string[];
  techStack: string[];
}) => {
  const response = await Api.post(
    pathMap.organization.create,
    organizationDetails,
  );

  return response.data;
};
