import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import { TaskSchema } from "../schemas/task.schema.js";
import { Types } from "mongoose";
import { NotFound } from "../utils/CustomError.js";

export const createTask = async (
  taskData: TaskSchema,
  userId: Types.ObjectId
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
