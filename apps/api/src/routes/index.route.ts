import { Router } from "express";

import healthRouter from "./health.routes.js";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";

const router = Router();

router.use("/health", healthRouter);

router.use("/auth", authRouter);
router.use("/user", userRouter);

export default router;
