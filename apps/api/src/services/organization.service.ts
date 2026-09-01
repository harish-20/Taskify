import { Types } from "mongoose";

import { Board } from "../models/board.model.js";
import { IOrganization, Organization } from "../models/organization.model.js";
import {
  IOrganizationProfile,
  OrganizationProfile,
} from "../models/organizationProfile.model.js";
import { User, UserRole } from "../models/user.model.js";
import { InviteMemberInput } from "../schemas/organization.schema.js";
import { NotFound } from "../utils/CustomError.js";

import { createInvitedUser } from "./user.service.js";

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

  await Board.create({
    name: "My first board",
    organization: organization._id,
    createdBy: ownerId,
    members: [ownerId],
    columns: [
      { name: "To do", order: 0 },
      { name: "In progress", order: 1 },
      { name: "Review", order: 2 },
      { name: "Done", order: 3 },
    ],
  });

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

export const inviteOrganizationMember = async (
  input: InviteMemberInput,
  organizationId: Types.ObjectId,
) => {
  const organization = await Organization.findById(organizationId);
  if (!organization) {
    throw new NotFound("Organization not found");
  }

  const invitedUser = await createInvitedUser({
    name: input.name,
    email: input.email,
    role: input.role as UserRole | undefined,
    organizationId,
  });

  await Organization.findByIdAndUpdate(organizationId, {
    $addToSet: { members: invitedUser._id },
  });

  return invitedUser;
};
