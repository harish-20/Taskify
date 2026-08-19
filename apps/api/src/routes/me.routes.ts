import { Router } from "express";

import { getMe } from "../controllers/me.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getMe);

export default router;
