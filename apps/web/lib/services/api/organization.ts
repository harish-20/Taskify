import { ApiResponse } from "@repo/shared/types";

import Api from ".";
import pathMap from "./pathMap";
import { AxiosResponse } from "axios";

interface OrganizationResponse {
  organization: Organization;
  organizationProfile: OrganizationProfile;
}

export const createOrganization = async (
  organizationDetails: Partial<Organization & OrganizationProfile>
) => {
  const response = await Api.post<
    AxiosResponse<ApiResponse<OrganizationResponse>>,
    ApiResponse<OrganizationResponse>,
    Partial<Organization & OrganizationProfile>
  >(pathMap.auth.verifyToken, organizationDetails);

  return response.data;
};
