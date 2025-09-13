import { ApiResponse } from "@repo/shared/types";

import { Unauthorized } from "../utils/CustomError.js";
import { sendResponse } from "../utils/response.js";

import { RequestHandler } from "express";

import { OrganizationSchema } from "../schemas/organization.schema.js";
import {
  createOrganization,
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

    const orgData = req.body as OrganizationSchema;
    const organization = await createOrganization(orgData, user._id);

    const payload: ApiResponse = {
      success: true,
      message: "Organization registered successfully",
      data: organization,
    };

    return sendResponse(res, 201, payload);
  } catch (err) {
    next(err);
  }
};
