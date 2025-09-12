import { z } from "zod";
import { MONGO_DB_ID_RX } from "../constants/MongoDbIdRegex.js";
import { TaskType, TaskStatus, TaskPriority } from "../models/task.model.js";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required").trim(),
  description: z.string().trim().optional(),
  type: z.enum(TaskType).optional().default(TaskType.TASK),
  status: z.enum(TaskStatus).optional().default(TaskStatus.TODO),
  priority: z.enum(TaskPriority).optional().default(TaskPriority.MEDIUM),
  dueDate: z.coerce.date().optional(),
  assignees: z
    .array(z.string().regex(MONGO_DB_ID_RX, "Invalid user ID"))
    .optional(),
});

export type TaskSchema = z.infer<typeof createTaskSchema>;
