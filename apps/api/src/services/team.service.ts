import { NotFound } from "../utils/CustomError.js";
import { Team } from "../models/team.model.js";
import { Organization } from "../models/organization.model.js";
import { TeamSchema } from "../schemas/team.schema.js";
import { Types } from "mongoose";

export const createTeam = async (
  input: TeamSchema,
  ownerId: Types.ObjectId
) => {
  const org = await Organization.findById(input.organizationId);
  if (!org) {
    throw new NotFound("Organization not found");
  }

  const team = await Team.create({
    name: input.name,
    description: input.description,
    organization: input.organizationId,
    members: input.members ?? [ownerId],
  });

  return team;
};
