import { Router } from "express";

import authRouter from "./auth.routes.js";
import healthRouter from "./health.routes.js";
import meRouter from "./me.routes.js";
import organizationRouter from "./organization.routes.js";
import taskRouter from "./task.routes.js";
import teamRouter from "./team.routes.js";
import userRouter from "./user.routes.js";

const router = Router();

router.use("/health", healthRouter);

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/me", meRouter);
router.use("/organization", organizationRouter);
router.use("/team", teamRouter);
router.use("/task", taskRouter);

export default router;
