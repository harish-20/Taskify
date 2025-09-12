import { createTaskSchema } from "../schemas/task.schema.js";

import { Router } from "express";

import { validateRequest } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import { createTask } from "../controllers/task.controller.js";

const router = Router();

router.post("/", authMiddleware, validateRequest(createTaskSchema), createTask);

export default router;
