import { ApiResponse } from "@repo/shared/types";

import { Unauthorized } from "../utils/CustomError.js";
import { sendResponse } from "../utils/response.js";

import { RequestHandler } from "express";

import {
  createTask as createTaskService,
  getTasks as getTasksService,
  updateTaskStatus as updateTaskStatusService,
} from "../services/task.service.js";

export const createTask: RequestHandler = async (req, res, next) => {
  try {
    const user = req.userObj;
    if (!user) throw new Unauthorized();

    const task = await createTaskService(req.body, user._id);

    const payload: ApiResponse = {
      success: true,
      message: "Task created successfully",
      data: task,
    };

    return sendResponse(res, 201, payload);
  } catch (err) {
    next(err);
  }
};

export const getTasks: RequestHandler<{}, { tasks: any[] }> = async (
  req,
  res,
  next,
) => {
  try {
    const user = req.userObj;
    if (!user) throw new Unauthorized();
    const tasks = await getTasksService(user._id);
    const payload: ApiResponse = {
      success: true,
      message: "Tasks retrieved successfully",
      data: tasks,
    };
    return sendResponse(res, 200, payload);
  } catch (err) {
    next(err);
  }
};

export const updateTaskStatus: RequestHandler = async (req, res, next) => {
  try {
    const user = req.userObj;
    if (!user) throw new Unauthorized();

    const task = await updateTaskStatusService(req.params.taskId, req.body.status, user._id);

    const payload: ApiResponse = {
      success: true,
      message: "Task status updated successfully",
      data: task,
    };

    return sendResponse(res, 200, payload);
  } catch (err) {
    next(err);
  }
};
