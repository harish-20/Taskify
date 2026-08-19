import { ApiResponse } from "@repo/shared/types";
import { RequestHandler } from "express";

import { NotFound } from "../utils/CustomError.js";
import { sendResponse } from "../utils/response.js";

export const getMe: RequestHandler<{}, ApiResponse<Express.User>> = async (
  req,
  res,
  next,
) => {
  try {
    const user = req.userObj;

    if (user) {
      const payload: ApiResponse = {
        success: true,
        message: "User fetched successfully",
        data: user,
      };
      return sendResponse(res, 200, payload);
    } else {
      throw new NotFound("User not found");
    }
  } catch (error) {
    next(error);
  }
};
