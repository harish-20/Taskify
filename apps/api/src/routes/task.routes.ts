import { createTaskSchema } from "../schemas/task.schema.js";

import { Router } from "express";

import { validateRequest } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import { createTask, getTasks } from "../controllers/task.controller.js";

const taskRouter = Router();

taskRouter.get("/", authMiddleware, getTasks);
taskRouter.post(
  "/",
  authMiddleware,
  validateRequest(createTaskSchema),
  createTask,
);

export default taskRouter;
