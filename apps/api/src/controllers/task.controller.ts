import { RequestHandler } from "express";
import { Unauthorized } from "../utils/CustomError.js";
import { createTaskSchema } from "../schemas/task.schema.js";
import { createTask as createTaskService } from "../services/task.service.js";
import { ApiResponse } from "@repo/shared/types";
import { sendResponse } from "../utils/response.js";

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
