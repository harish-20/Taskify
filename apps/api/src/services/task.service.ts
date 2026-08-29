import { PopulateOptions, Types } from "mongoose";

import { Board } from "../models/board.model.js";
import { Task, TaskStatus } from "../models/task.model.js";
import { TaskCounter } from "../models/taskCounter.model.js";
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
  {
    path: "parentTask",
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
  organizationId: Types.ObjectId,
) => {
  if (!userId) {
    throw new NotFound("User not found");
  }

  const board = await Board.exists({
    _id: taskData.board,
    organization: organizationId,
    isArchived: false,
  });
  if (!board) {
    throw new NotFound("Board not found");
  }

  const counter = await TaskCounter.findOneAndUpdate(
    { organizationId: organizationId },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  const task = await Task.create({
    ...taskData,
    ticketId: `TICKET-${counter.seq}`,
    createdBy: userId,
    organizationId: organizationId,
  });
  await task.populate(TASK_POPULATE_OPTIONS);

  return task;
};

export const getTasks = async (
  organizationId: Types.ObjectId,
  boardId: string,
) => {
  const board = await Board.exists({
    _id: boardId,
    organization: organizationId,
    isArchived: false,
  });
  if (!board) {
    throw new NotFound("Board not found");
  }

  const tasks = await Task.find({
    organizationId: organizationId,
    board: boardId,
    isDeleted: false,
  }).populate(TASK_POPULATE_OPTIONS);

  return tasks;
};

export const getTask = async (
  organizationId: Types.ObjectId,
  taskId: string,
) => {
  const task = await Task.findOne({
    _id: taskId,
    organizationId: organizationId,
    isDeleted: false,
  }).populate(TASK_POPULATE_OPTIONS);

  if (!task) {
    throw new NotFound("Task not found");
  }

  return task;
};

export const updateTask = async (
  taskId: string,
  taskData: UpdateTaskSchema,
  organizationId: Types.ObjectId,
) => {
  const task = await Task.findOne({
    _id: taskId,
    organizationId: organizationId,
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

export const getAvailableSubtasks = async (
  taskId: string,
  organizationId: Types.ObjectId,
) => {
  const tasks = await Task.find({
    _id: { $ne: taskId },
    parentTask: { $exists: false },
    subTasks: { $exists: true, $size: 0 },
    organizationId: organizationId,
    isDeleted: false,
  }).populate(TASK_POPULATE_OPTIONS);

  return tasks;
};

export const addSubTask = async (
  taskId: string,
  subTaskId: string,
  organizationId: Types.ObjectId,
) => {
  if (taskId === subTaskId) {
    throw new InvalidArgument("A task cannot be added as its own subtask");
  }

  const parentTask = await Task.findOne({
    _id: taskId,
    organizationId: organizationId,
    isDeleted: false,
  });

  if (!parentTask) {
    throw new NotFound("Task not found");
  }

  const subTask = await Task.findOne({
    _id: subTaskId,
    organizationId: organizationId,
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
        {
          _id: subTask.parentTask,
          organizationId: organizationId,
          isDeleted: false,
        },
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
  organizationId: Types.ObjectId,
) => {
  const parentTask = await Task.findOne({
    _id: taskId,
    organizationId: organizationId,
    isDeleted: false,
  });

  if (!parentTask) {
    throw new NotFound("Task not found");
  }

  const subTask = await Task.findOne({
    _id: subTaskId,
    organizationId: organizationId,
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

export const deleteTask = async (
  taskId: string,
  organizationId: Types.ObjectId,
) => {
  const task = await Task.findOne({
    _id: taskId,
    organizationId: organizationId,
    isDeleted: false,
  });

  if (!task) {
    throw new NotFound("Task not found");
  }

  task.isDeleted = true;
  await task.save();

  return task;
};
