import { Organization } from "../models/organization.model.js";
import { Types } from "mongoose";
import { OrganizationSchema } from "../schemas/organization.schema.js";

export const getOrganization = async () => {
  const organizations = await Organization.find({});

  return organizations;
};

export const createOrganization = async (
  data: OrganizationSchema,
  ownerId: Types.ObjectId
) => {
  const organization = await Organization.create({
    ...data,
    owner: ownerId,
    members: [ownerId],
  });

  return organization;
};
