import { Types } from "mongoose";

import { Organization } from "../models/organization.model.js";
import { Team } from "../models/team.model.js";
import { TeamSchema } from "../schemas/team.schema.js";
import { NotFound } from "../utils/CustomError.js";

export const getTeam = async (organizationId: Types.ObjectId) => {
  const teams = await Team.find({ organization: organizationId });

  return teams;
};

export const createTeam = async (
  input: TeamSchema,
  ownerId: Types.ObjectId,
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

export const addTeamMember = async (
  teamId: Types.ObjectId | string,
  memberId: Types.ObjectId | string,
) => {
  const team = await Team.findByIdAndUpdate(
    teamId,
    { $addToSet: { members: memberId } },
    { new: true },
  );
  if (!team) {
    throw new NotFound("Team not found");
  }

  return team;
};

export const removeTeamMember = async (
  teamId: Types.ObjectId | string,
  memberId: Types.ObjectId | string,
) => {
  const team = await Team.findByIdAndUpdate(
    teamId,
    { $pull: { members: memberId } },
    { new: true },
  );
  if (!team) {
    throw new NotFound("Team not found");
  }

  return team;
};
