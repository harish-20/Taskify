import { IOrganization, Organization } from "../models/organization.model.js";
import { Types } from "mongoose";
import {
  IOrganizationProfile,
  OrganizationProfile,
} from "../models/organizationProfile.model.js";
import { User } from "../models/user.model.js";

export const getOrganization = async () => {
  const organizations = await Organization.find({});

  return organizations;
};

export const createOrganization = async (
  data: Partial<IOrganization>,
  ownerId: Types.ObjectId,
) => {
  const organization = await Organization.create({
    ...data,
    owner: ownerId,
    members: [ownerId],
  });

  await User.findByIdAndUpdate(ownerId, { organizationId: organization._id });

  return organization;
};

export const createOrganizationProfile = async (
  data: Partial<IOrganizationProfile>,
  organizationId: Types.ObjectId,
) => {
  const organizationProfile = await OrganizationProfile.create({
    ...data,
    organization: organizationId,
  });

  await Organization.findByIdAndUpdate(organizationId, {
    profile: organizationProfile._id,
  });

  return organizationProfile;
};

export const getOrganizationUsers = async (organizationId: Types.ObjectId) => {
  const users = await User.find(
    { organizationId },
    { name: 1, email: 1, avatarUrl: 1, role: 1, status: 1 },
  );

  return users;
};
