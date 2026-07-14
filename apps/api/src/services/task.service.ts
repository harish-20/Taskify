import { Task, TaskStatus } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import { TaskSchema } from "../schemas/task.schema.js";
import { Types } from "mongoose";
import { NotFound } from "../utils/CustomError.js";

export const createTask = async (
  taskData: TaskSchema,
  userId: Types.ObjectId,
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFound("User not found");
  }

  const task = await Task.create({
    ...taskData,
    createdBy: userId,
    organizationId: user.organizationId,
  });

  return task;
};

export const getTasks = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFound("User not found");
  }
  const tasks = await Task.find({ createdBy: userId });

  return tasks;
};

export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus,
  userId: Types.ObjectId,
) => {
  const task = await Task.findOne({ _id: taskId, createdBy: userId });

  if (!task) {
    throw new NotFound("Task not found");
  }

  task.status = status;
  await task.save();

  return task;
};
