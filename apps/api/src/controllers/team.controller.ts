import { ApiResponse } from "@repo/shared/types";

import { NotFound, Unauthorized } from "../utils/CustomError.js";
import { sendResponse } from "../utils/response.js";

import { RequestHandler } from "express";

import {
  createTeam,
  getTeam as getTeamService,
} from "../services/team.service.js";
import logger from "../utils/logger.js";

export const getTeam: RequestHandler = async (req, res, next) => {
  try {
    const user = req.userObj;
    if (!user) {
      throw new Unauthorized();
    }

    logger.debug(user);

    if (!user.organizationId) {
      throw new NotFound("user has not joined any organization");
    }

    const teams = await getTeamService(user.organizationId);

    const payload: ApiResponse = {
      success: true,
      message: "Teams fetched succesfully.",
      data: teams,
    };
    sendResponse(res, 200, payload);
  } catch (err) {
    next(err);
  }
};

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
