import { ApiResponse } from "@repo/shared/types";
import { RequestHandler } from "express";

import {
  addSubTask as addSubTaskService,
  createTask as createTaskService,
  getTask as getTaskService,
  deleteTask as deleteTaskService,
  getTasks as getTasksService,
  removeSubTask as removeSubTaskService,
  updateTask as updateTaskService,
  getAvailableSubtasks as getAvailableSubtasksService,
} from "../services/task.service.js";
import { Unauthorized } from "../utils/CustomError.js";
import { sendResponse } from "../utils/response.js";

export const createTask: RequestHandler = async (req, res, next) => {
  try {
    const user = req.userObj;
    if (!user) throw new Unauthorized();

    const task = await createTaskService(
      req.body,
      user._id,
      user.organizationId,
    );

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
    const boardId = req.query.boardId;
    if (boardId !== undefined && typeof boardId !== "string") {
      throw new Unauthorized("Invalid board ID");
    }
    const tasks = await getTasksService(user.organizationId, boardId);
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

export const getTaskById: RequestHandler = async (req, res, next) => {
  try {
    const user = req.userObj;
    if (!user) throw new Unauthorized();
    const task = await getTaskService(user.organizationId, req.params.taskId);
    const payload: ApiResponse = {
      success: true,
      message: "Task retrieved successfully",
      data: task,
    };
    return sendResponse(res, 200, payload);
  } catch (err) {
    next(err);
  }
};
export const updateTask: RequestHandler = async (req, res, next) => {
  try {
    const user = req.userObj;
    if (!user) throw new Unauthorized();

    const task = await updateTaskService(
      req.params.taskId,
      req.body,
      user.organizationId,
    );

    const payload: ApiResponse = {
      success: true,
      message: "Task updated successfully",
      data: task,
    };

    return sendResponse(res, 200, payload);
  } catch (err) {
    next(err);
  }
};

export const getAvailableSubtasks: RequestHandler = async (req, res, next) => {
  try {
    const user = req.userObj;
    if (!user) throw new Unauthorized();

    const task = await getAvailableSubtasksService(
      req.params.taskId,
      user.organizationId,
    );

    const payload: ApiResponse = {
      success: true,
      message: "Available subtasks retrieved successfully",
      data: task,
    };

    return sendResponse(res, 200, payload);
  } catch (err) {
    next(err);
  }
};

export const addSubTask: RequestHandler = async (req, res, next) => {
  try {
    const user = req.userObj;
    if (!user) throw new Unauthorized();

    const task = await addSubTaskService(
      req.params.taskId,
      req.body.subTaskId,
      user.organizationId,
    );

    const payload: ApiResponse = {
      success: true,
      message: "Subtask added successfully",
      data: task,
    };

    return sendResponse(res, 200, payload);
  } catch (err) {
    next(err);
  }
};

export const removeSubTask: RequestHandler = async (req, res, next) => {
  try {
    const user = req.userObj;
    if (!user) throw new Unauthorized();

    const task = await removeSubTaskService(
      req.params.taskId,
      req.body.subTaskId,
      user.organizationId,
    );

    const payload: ApiResponse = {
      success: true,
      message: "Subtask removed successfully",
      data: task,
    };

    return sendResponse(res, 200, payload);
  } catch (err) {
    next(err);
  }
};

export const deleteTask: RequestHandler = async (req, res, next) => {
  try {
    const user = req.userObj;
    if (!user) throw new Unauthorized();

    await deleteTaskService(req.params.taskId, user.organizationId);

    const payload: ApiResponse = {
      success: true,
      message: "Task deleted successfully",
      data: null,
    };

    return sendResponse(res, 200, payload);
  } catch (err) {
    next(err);
  }
};
