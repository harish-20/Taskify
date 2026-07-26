import { PopulateOptions, Types } from "mongoose";

import { Task, TaskStatus } from "../models/task.model.js";
import { TaskCounter } from "../models/taskCounter.model.js";
import { User } from "../models/user.model.js";
import { TaskSchema, UpdateTaskSchema } from "../schemas/task.schema.js";
import { NotFound } from "../utils/CustomError.js";

const TASK_POPULATE_OPTIONS: PopulateOptions[] = [
  {
    path: "assignees",
    select: "_id name avatarUrl",
  },
  {
    path: "watchers",
    select: "_id name avatarUrl",
  },
  {
    path: "createdBy",
    select: "_id name avatarUrl",
  },
  {
    path: "parentTask",
  },
  {
    path: "blockedBy",
  },
  {
    path: "blocking",
  },
  {
    path: "subTasks",
    select: "_id title status assignees ticketId createdAt type",
    populate: {
      path: "assignees",
      select: "_id name avatarUrl",
    },
  },
];

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
  const tasks = await Task.find({
    createdBy: userId,
    isDeleted: false,
  }).populate(TASK_POPULATE_OPTIONS);

  return tasks;
};

export const getTask = async (userId: Types.ObjectId, taskId: string) => {
  const task = await Task.findOne({
    _id: taskId,
    createdBy: userId,
    isDeleted: false,
  }).populate(TASK_POPULATE_OPTIONS);

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
  const updatedTask = await task.save();
  await updatedTask.populate(TASK_POPULATE_OPTIONS);

  return updatedTask;
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
  const updatedTask = await task.save();
  await updatedTask.populate(TASK_POPULATE_OPTIONS);

  return updatedTask;
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
