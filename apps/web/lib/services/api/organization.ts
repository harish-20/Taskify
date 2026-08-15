import { ApiResponse } from '@repo/shared/types';

import pathMap from './pathMap';

import Api from '.';

import type { Organization, OrganizationProfile } from '@/lib/types/organization';


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
  const response = await Api.post<ApiResponse>(pathMap.organization.create, organizationDetails);

  return response.data;
};

export const getOrganizationUsers = async () => {
  const response = await Api.get<ApiResponse>(pathMap.organization.getOrganizationUsers);

  return response.data;
};
