import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "../schemas/task.schema.js";

import { Router } from "express";

import { validateRequest } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import {
  createTask,
  deleteTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
} from "../controllers/task.controller.js";

const taskRouter = Router();

taskRouter.get("/", authMiddleware, getTasks);
taskRouter.get("/:taskId", authMiddleware, getTaskById);

taskRouter.post(
  "/",
  authMiddleware,
  validateRequest(createTaskSchema),
  createTask,
);
taskRouter.patch(
  "/status/:taskId",
  authMiddleware,
  validateRequest(updateTaskStatusSchema),
  updateTaskStatus,
);
taskRouter.patch(
  "/:taskId",
  authMiddleware,
  validateRequest(updateTaskSchema),
  updateTask,
);
taskRouter.delete("/:taskId", authMiddleware, deleteTask);

export default taskRouter;
