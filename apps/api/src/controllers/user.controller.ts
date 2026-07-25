import { RequestHandler } from "express";

import { ApiResponse } from "@repo/shared/types";

import { Forbidden, Unauthorized } from "../utils/CustomError.js";
import { sendResponse } from "../utils/response.js";

import { createTestUsers } from "../services/user.service.js";
import { CreateTestUsersSchema } from "../schemas/user.schema.js";

export const getUser: RequestHandler = (req, res, next) => {
  try {
    const user = req.userObj;

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const registerTestUsers: RequestHandler = async (req, res, next) => {
  try {
    const user = req.userObj;
    if (!user) {
      throw new Unauthorized();
    }

    const { organizationId, count } = req.body as CreateTestUsersSchema;

    if (!user.organizationId || user.organizationId.toString() !== organizationId) {
      throw new Forbidden(
        "You can only create test users for your own organization",
      );
    }

    const createdUsers = await createTestUsers({ organizationId, count });

    const payload: ApiResponse = {
      success: true,
      message: "Test users created successfully",
      data: createdUsers,
    };

    return sendResponse(res, 201, payload);
  } catch (error) {
    next(error);
  }
};
