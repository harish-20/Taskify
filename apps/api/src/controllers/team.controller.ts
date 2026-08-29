import { ApiResponse } from "@repo/shared/types";
import { RequestHandler } from "express";

import {
  addTeamMember,
  createTeam,
  getTeam as getTeamService,
  removeTeamMember,
} from "../services/team.service.js";
import { NotFound, Unauthorized } from "../utils/CustomError.js";
import logger from "../utils/logger.js";
import { sendResponse } from "../utils/response.js";

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

export const addMember: RequestHandler = async (req, res, next) => {
  try {
    const user = req.userObj;
    if (!user) {
      throw new Unauthorized();
    }

    const { teamId } = req.params;
    const { memberId } = req.body;

    const team = await addTeamMember(teamId, memberId);

    const payload: ApiResponse = {
      success: true,
      message: "Member added to team successfully",
      data: team,
    };

    return sendResponse(res, 200, payload);
  } catch (err) {
    next(err);
  }
};

export const removeMember: RequestHandler = async (req, res, next) => {
  try {
    const user = req.userObj;
    if (!user) {
      throw new Unauthorized();
    }

    const { teamId, memberId } = req.params;

    const team = await removeTeamMember(teamId, memberId);

    const payload: ApiResponse = {
      success: true,
      message: "Member removed from team successfully",
      data: team,
    };

    return sendResponse(res, 200, payload);
  } catch (err) {
    next(err);
  }
};
