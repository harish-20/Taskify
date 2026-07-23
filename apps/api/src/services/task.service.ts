import { Task, TaskStatus } from "../models/task.model.js";
import { TaskCounter } from "../models/taskCounter.model.js";
import { User } from "../models/user.model.js";
import { TaskSchema, UpdateTaskSchema } from "../schemas/task.schema.js";
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

  const counter = await TaskCounter.findOneAndUpdate(
    { organizationId: user.organizationId },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  const task = await Task.create({
    ...taskData,
    ticketId: `TICKET-${counter.seq}`,
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
  const tasks = await Task.find({ createdBy: userId, isDeleted: false });

  return tasks;
};

export const getTask = async (userId: Types.ObjectId, taskId: string) => {
  const task = await Task.findOne({
    _id: taskId,
    createdBy: userId,
    isDeleted: false,
  });

  if (!task) {
    throw new NotFound("Task not found");
  }

  return task;
};

export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus,
  userId: Types.ObjectId,
) => {
  const task = await Task.findOne({
    _id: taskId,
    createdBy: userId,
    isDeleted: false,
  });

  if (!task) {
    throw new NotFound("Task not found");
  }

  task.status = status;
  await task.save();

  return task;
};

export const updateTask = async (
  taskId: string,
  taskData: UpdateTaskSchema,
  userId: Types.ObjectId,
) => {
  const task = await Task.findOne({
    _id: taskId,
    createdBy: userId,
    isDeleted: false,
  });

  if (!task) {
    throw new NotFound("Task not found");
  }

  Object.assign(task, taskData);
  await task.save();

  return task;
};

export const deleteTask = async (taskId: string, userId: Types.ObjectId) => {
  const task = await Task.findOne({
    _id: taskId,
    createdBy: userId,
    isDeleted: false,
  });

  if (!task) {
    throw new NotFound("Task not found");
  }

  task.isDeleted = true;
  await task.save();

  return task;
};
