import { ApiResponse } from "@repo/shared/types";

import { Unauthorized } from "../utils/CustomError.js";
import { sendResponse } from "../utils/response.js";

import { RequestHandler } from "express";

import { createTeam } from "../services/team.service.js";

export const registerTeam: RequestHandler = async (req, res, next) => {
  try {
    const user = req.userObj;
    if (!user) {
      throw new Unauthorized();
    }

    const team = await createTeam(req.body, user._id);

    const payload: ApiResponse = {
      success: true,
      message: "Team created successfully",
      data: team,
    };

    return sendResponse(res, 201, payload);
  } catch (err) {
    next(err);
  }
};
