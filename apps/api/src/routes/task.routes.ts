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
  getAvailableSubtasks,
} from "../controllers/task.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  validateParams,
  validateRequest,
} from "../middlewares/validate.middleware.js";
import {
  addSubTaskSchema,
  createTaskSchema,
  removeSubTaskSchema,
  taskIdParamSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "../schemas/task.schema.js";

const taskRouter = Router();

taskRouter.get("/", authMiddleware, getTasks);
taskRouter.get(
  "/:taskId",
  authMiddleware,
  validateParams(taskIdParamSchema),
  getTaskById,
);

taskRouter.post(
  "/",
  authMiddleware,
  validateRequest(createTaskSchema),
  createTask,
);
taskRouter.patch(
  "/status/:taskId",
  authMiddleware,
  validateParams(taskIdParamSchema),
  validateRequest(updateTaskStatusSchema),
  updateTaskStatus,
);
taskRouter.patch(
  "/:taskId",
  authMiddleware,
  validateParams(taskIdParamSchema),
  validateRequest(updateTaskSchema),
  updateTask,
);
taskRouter.get(
  "/:taskId/available-subtasks",
  authMiddleware,
  validateParams(taskIdParamSchema),
  getAvailableSubtasks,
);
taskRouter.post(
  "/:taskId/subtasks",
  authMiddleware,
  validateParams(taskIdParamSchema),
  validateRequest(addSubTaskSchema),
  addSubTask,
);
taskRouter.patch(
  "/:taskId/subtasks/remove",
  authMiddleware,
  validateParams(taskIdParamSchema),
  validateRequest(removeSubTaskSchema),
  removeSubTask,
);
taskRouter.delete(
  "/:taskId",
  authMiddleware,
  validateParams(taskIdParamSchema),
  deleteTask,
);

export default taskRouter;
