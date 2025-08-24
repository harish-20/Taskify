import { Router } from "express";

import userRouter from "./user.routes.js";
import healthRouter from "./health.routes.js";

const router = Router();

router.use("/health", healthRouter);

router.use("/user", userRouter);

export default router;
