import { ApiResponse } from "@repo/shared/types";

import { Conflict, Unauthorized } from "../utils/CustomError.js";
import { sendResponse } from "../utils/response.js";

import { RequestHandler } from "express";

import { CreateOrganizationInput } from "../schemas/organization.schema.js";
import {
  createOrganization,
  createOrganizationProfile,
  getOrganization as getOrganizationService,
} from "../services/organization.service.js";

export const getOrganization: RequestHandler = async (req, res, next) => {
  try {
    const organizations = await getOrganizationService();

    const payload: ApiResponse = {
      success: true,
      message: "Organization fetched successfully",
      data: organizations,
    };
    sendResponse(res, 200, payload);
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
      user._id
    );

    const organizationProfile = await createOrganizationProfile(
      { size, techStack, industry, interests },
      organization.id
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
