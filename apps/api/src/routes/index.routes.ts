import { Router } from "express";

import healthRouter from "./health.routes.js";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import organizationRouter from "./organization.routes.js";
import teamRouter from "./team.routes.js";
import taskRouter from "./task.routes.js";

const router = Router();

router.use("/health", healthRouter);

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/organization", organizationRouter);
router.use("/team", teamRouter);
router.use("/task", taskRouter);

export default router;
