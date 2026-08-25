import { Router } from "express";

import { editMe, getMe, updateAvatar } from "../controllers/me.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { editUserSchema } from "../schemas/me.schema.js";

const router = Router();

router.get("/", authMiddleware, getMe);
router.patch("/", authMiddleware, validateRequest(editUserSchema), editMe);
router.put("/avatar", authMiddleware, upload.single("avatar"), updateAvatar);

export default router;
