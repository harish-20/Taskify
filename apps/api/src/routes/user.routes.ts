import { Router } from "express";

import { getUser, registerTestUsers } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleAuthMiddleware } from "../middlewares/roleAuth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { UserRole } from "../models/user.model.js";
import { createTestUsersSchema } from "../schemas/user.schema.js";

const userRouter = Router();

userRouter.get("/", authMiddleware, getUser);
userRouter.post(
	"/test-users",
	authMiddleware,
	roleAuthMiddleware([UserRole.ADMIN]),
	validateRequest(createTestUsersSchema),
	registerTestUsers,
);

export default userRouter;
