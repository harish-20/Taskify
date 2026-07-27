import { Router } from "express";

import {
  addSubTask,
  createTask,
  deleteTask,
  getTasks,
  getTaskById,
  removeSubTask,
  updateTask,
  updateTaskStatus,
} from "../controllers/task.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import {
  addSubTaskSchema,
  createTaskSchema,
  removeSubTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "../schemas/task.schema.js";

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
taskRouter.post(
  "/:taskId/subtasks",
  authMiddleware,
  validateRequest(addSubTaskSchema),
  addSubTask,
);
taskRouter.patch(
  "/:taskId/subtasks/remove",
  authMiddleware,
  validateRequest(removeSubTaskSchema),
  removeSubTask,
);
taskRouter.delete("/:taskId", authMiddleware, deleteTask);

export default taskRouter;
