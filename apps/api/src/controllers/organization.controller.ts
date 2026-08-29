import { ApiResponse } from "@repo/shared/types";
import { RequestHandler } from "express";

import {
  CreateOrganizationInput,
  InviteMemberInput,
} from "../schemas/organization.schema.js";
import {
  createOrganization,
  createOrganizationProfile,
  getOrganization as getOrganizationService,
  getOrganizationUsers as getOrganizationUsersService,
  inviteOrganizationMember,
} from "../services/organization.service.js";
import { Conflict, Unauthorized } from "../utils/CustomError.js";
import { sendResponse } from "../utils/response.js";

export const getOrganization: RequestHandler = async (req, res, next) => {
  try {
    const organizations = await getOrganizationService();

    const payload: ApiResponse = {
      success: true,
      message: "Organization fetched successfully",
      data: organizations,
    };
    return sendResponse(res, 200, payload);
  } catch (err) {
    next(err);
  }
};

export const registerOrganization: RequestHandler = async (req, res, next) => {
  try {
    const user = req.userObj;
    if (!user) {
      throw new Unauthorized();
    }
    if (user.organizationId) {
      throw new Conflict("Organization is already exist for this user");
    }

    const {
      name,
      address,
      contactEmail,
      description,
      phoneNumber,
      website,
      // profile informations
      size,
      techStack,
      industry,
      interests,
    } = req.body as CreateOrganizationInput;

    const organization = await createOrganization(
      { name, description, address, contactEmail, phoneNumber, website },
      user._id,
    );

    const organizationProfile = await createOrganizationProfile(
      { size, techStack, industry, interests },
      organization.id,
    );

    const payload: ApiResponse = {
      success: true,
      message: "Organization registered successfully",
      data: { organization, organizationProfile },
    };

    return sendResponse(res, 201, payload);
  } catch (err) {
    next(err);
  }
};

export const getOrganizationUsers: RequestHandler = async (req, res, next) => {
  try {
    const user = req.userObj;
    if (!user) {
      throw new Unauthorized();
    }

    const organizationUsers = await getOrganizationUsersService(
      user.organizationId,
    );

    const payload: ApiResponse = {
      success: true,
      message: "Organinzation users fetched successfully",
      data: [...organizationUsers],
    };
    return sendResponse(res, 200, payload);
  } catch (err) {
    next(err);
  }
};

export const inviteMember: RequestHandler = async (req, res, next) => {
  try {
    const user = req.userObj;
    if (!user) {
      throw new Unauthorized();
    }
    if (!user.organizationId) {
      throw new Conflict("User has not joined any organization");
    }

    const invitedUser = await inviteOrganizationMember(
      req.body as InviteMemberInput,
      user.organizationId,
    );

    const payload: ApiResponse = {
      success: true,
      message: "Invitation sent successfully",
      data: invitedUser,
    };
    return sendResponse(res, 201, payload);
  } catch (err) {
    next(err);
  }
};
