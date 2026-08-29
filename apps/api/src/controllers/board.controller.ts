import { ApiResponse } from "@repo/shared/types";
import { RequestHandler } from "express";
import { Types } from "mongoose";

import { CreateBoardInput, UpdateBoardInput } from "../schemas/board.schema.js";
import {
  archiveBoard,
  createBoard as createBoardService,
  getBoard as getBoardService,
  getBoards as getBoardsService,
  updateBoard as updateBoardService,
} from "../services/board.service.js";
import { NotFound, Unauthorized } from "../utils/CustomError.js";
import { sendResponse } from "../utils/response.js";

const getOrganizationId = (
  user: { _id: Types.ObjectId; organizationId?: Types.ObjectId } | undefined,
) => {
  if (!user) throw new Unauthorized();
  if (!user.organizationId)
    throw new NotFound("User has not joined an organization");
  return user.organizationId;
};

export const getBoards: RequestHandler = async (req, res, next) => {
  try {
    const boards = await getBoardsService(getOrganizationId(req.userObj));
    return sendResponse(res, 200, {
      success: true,
      message: "Boards retrieved successfully",
      data: boards,
    } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
};

export const getBoard: RequestHandler = async (req, res, next) => {
  try {
    const board = await getBoardService(
      req.params.boardId,
      getOrganizationId(req.userObj),
    );
    return sendResponse(res, 200, {
      success: true,
      message: "Board retrieved successfully",
      data: board,
    } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
};

export const createBoard: RequestHandler = async (req, res, next) => {
  try {
    const user = req.userObj;
    const organizationId = getOrganizationId(user);
    const board = await createBoardService(
      req.body as CreateBoardInput,
      user!._id,
      organizationId,
    );
    return sendResponse(res, 201, {
      success: true,
      message: "Board created successfully",
      data: board,
    } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
};

export const updateBoard: RequestHandler = async (req, res, next) => {
  try {
    const board = await updateBoardService(
      req.params.boardId,
      req.body as UpdateBoardInput,
      getOrganizationId(req.userObj),
    );
    return sendResponse(res, 200, {
      success: true,
      message: "Board updated successfully",
      data: board,
    } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
};

export const deleteBoard: RequestHandler = async (req, res, next) => {
  try {
    const deleteTasks = req.query.deleteTasks === "true";
    await archiveBoard(
      req.params.boardId,
      getOrganizationId(req.userObj),
      deleteTasks,
    );
    return sendResponse(res, 200, {
      success: true,
      message: "Board deleted successfully",
      data: null,
    } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
};
