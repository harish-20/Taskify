import { PopulateOptions, Types } from "mongoose";

import { Task, TaskStatus } from "../models/task.model.js";
import { TaskCounter } from "../models/taskCounter.model.js";
import { User } from "../models/user.model.js";
import { TaskSchema, UpdateTaskSchema } from "../schemas/task.schema.js";
import { InvalidArgument, NotFound } from "../utils/CustomError.js";

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
    select: "_id title status assignees createdBy ticketId createdAt type",
    populate: [
      {
        path: "assignees",
        select: "_id name avatarUrl",
      },
      {
        path: "createdBy",
        select: "_id name avatarUrl",
      },
    ],
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

export const addSubTask = async (
  taskId: string,
  subTaskId: string,
  userId: Types.ObjectId,
) => {
  if (taskId === subTaskId) {
    throw new InvalidArgument("A task cannot be added as its own subtask");
  }

  const parentTask = await Task.findOne({
    _id: taskId,
    createdBy: userId,
    isDeleted: false,
  });

  if (!parentTask) {
    throw new NotFound("Task not found");
  }

  const subTask = await Task.findOne({
    _id: subTaskId,
    createdBy: userId,
    isDeleted: false,
  });

  if (!subTask) {
    throw new NotFound("Subtask not found");
  }

  const parentTaskObjectId = new Types.ObjectId(taskId);
  const subTaskObjectId = new Types.ObjectId(subTaskId);

  const alreadyLinked = parentTask.subTasks.some((id) =>
    id.equals(subTaskObjectId),
  );

  if (!alreadyLinked) {
    parentTask.subTasks.push(subTaskObjectId);
  }

  if (!subTask.parentTask || !subTask.parentTask.equals(parentTaskObjectId)) {
    if (subTask.parentTask) {
      await Task.updateOne(
        { _id: subTask.parentTask, createdBy: userId, isDeleted: false },
        { $pull: { subTasks: subTaskObjectId } },
      );
    }

    subTask.parentTask = parentTaskObjectId;
  }

  await Promise.all([parentTask.save(), subTask.save()]);
  await parentTask.populate(TASK_POPULATE_OPTIONS);

  return parentTask;
};

export const removeSubTask = async (
  taskId: string,
  subTaskId: string,
  userId: Types.ObjectId,
) => {
  const parentTask = await Task.findOne({
    _id: taskId,
    createdBy: userId,
    isDeleted: false,
  });

  if (!parentTask) {
    throw new NotFound("Task not found");
  }

  const subTask = await Task.findOne({
    _id: subTaskId,
    createdBy: userId,
    isDeleted: false,
  });

  if (!subTask) {
    throw new NotFound("Subtask not found");
  }

  const parentTaskObjectId = new Types.ObjectId(taskId);
  const subTaskObjectId = new Types.ObjectId(subTaskId);

  parentTask.subTasks = parentTask.subTasks.filter(
    (id) => !id.equals(subTaskObjectId),
  );

  if (subTask.parentTask?.equals(parentTaskObjectId)) {
    subTask.parentTask = undefined;
  }

  await Promise.all([parentTask.save(), subTask.save()]);
  await parentTask.populate(TASK_POPULATE_OPTIONS);

  return parentTask;
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
