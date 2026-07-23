import { MONGO_DB_ID_RX } from "../constants/MongoDbIdRegex.js";

import { z } from "zod";

import { TaskType, TaskStatus, TaskPriority } from "../models/task.model.js";

export const createTaskSchema = z.object({
  ticketId: z.undefined(),
  title: z.string().min(1, "Task title is required").trim(),
  description: z.string().trim().optional(),
  type: z.enum(TaskType).optional().default(TaskType.TASK),
  status: z.enum(TaskStatus).optional().default(TaskStatus.TODO),
  priority: z.enum(TaskPriority).optional().default(TaskPriority.MEDIUM),
  estimate: z.number().min(0, "Estimate cannot be negative").optional(),
  spentTime: z.number().min(0, "Spent time cannot be negative").optional(),
  remainingTime: z
    .number()
    .min(0, "Remaining time cannot be negative")
    .optional(),
  startDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional(),
  assignees: z
    .array(z.string().regex(MONGO_DB_ID_RX, "Invalid user ID"))
    .optional(),
  watchers: z
    .array(z.string().regex(MONGO_DB_ID_RX, "Invalid watcher ID"))
    .optional(),
  tags: z
    .array(z.string().trim().min(1, "Tag cannot be empty"))
    .optional()
    .default([]),
  checklist: z
    .array(
      z.object({
        title: z.string().trim().min(1, "Checklist title is required"),
        completed: z.boolean().optional().default(false),
      }),
    )
    .optional(),
  parentTask: z
    .string()
    .regex(MONGO_DB_ID_RX, "Invalid parent task ID")
    .optional(),
  subTasks: z
    .array(z.string().regex(MONGO_DB_ID_RX, "Invalid sub-task ID"))
    .optional(),
  blockedBy: z
    .array(z.string().regex(MONGO_DB_ID_RX, "Invalid blocked-by task ID"))
    .optional(),
  blocking: z
    .array(z.string().regex(MONGO_DB_ID_RX, "Invalid blocking task ID"))
    .optional(),
  position: z.number().optional(),
  color: z.string().trim().optional(),
  isArchived: z.boolean().optional(),
  organizationId: z.undefined(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(TaskStatus),
});

export const updateTaskSchema = z
  .object({
    ticketId: z.undefined(),
    organizationId: z.undefined(),
    title: z.string().min(1, "Task title is required").trim().optional(),
    description: z.string().trim().optional(),
    type: z.enum(TaskType).optional(),
    status: z.enum(TaskStatus).optional(),
    priority: z.enum(TaskPriority).optional(),
    estimate: z.number().min(0, "Estimate cannot be negative").optional(),
    spentTime: z.number().min(0, "Spent time cannot be negative").optional(),
    remainingTime: z
      .number()
      .min(0, "Remaining time cannot be negative")
      .optional(),
    startDate: z.coerce.date().optional(),
    dueDate: z.coerce.date().optional(),
    completedAt: z.coerce.date().optional(),
    assignees: z
      .array(z.string().regex(MONGO_DB_ID_RX, "Invalid user ID"))
      .optional(),
    watchers: z
      .array(z.string().regex(MONGO_DB_ID_RX, "Invalid watcher ID"))
      .optional(),
    tags: z.array(z.string().trim().min(1, "Tag cannot be empty")).optional(),
    checklist: z
      .array(
        z.object({
          title: z.string().trim().min(1, "Checklist title is required"),
          completed: z.boolean().optional().default(false),
        }),
      )
      .optional(),
    parentTask: z
      .string()
      .regex(MONGO_DB_ID_RX, "Invalid parent task ID")
      .optional(),
    subTasks: z
      .array(z.string().regex(MONGO_DB_ID_RX, "Invalid sub-task ID"))
      .optional(),
    blockedBy: z
      .array(z.string().regex(MONGO_DB_ID_RX, "Invalid blocked-by task ID"))
      .optional(),
    blocking: z
      .array(z.string().regex(MONGO_DB_ID_RX, "Invalid blocking task ID"))
      .optional(),
    position: z.number().optional(),
    color: z.string().trim().optional(),
    isArchived: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  });

export type TaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
