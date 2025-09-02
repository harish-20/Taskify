import { Router } from "express";
import passport from "passport";

import { validateRequest } from "../middlewares/validate.middleware.js";
import { registerSchema } from "../schemas/auth.schema.js";

import {
  refreshAccessToken,
  registerUser,
  signinUser,
  verifyMagicLink,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", validateRequest(registerSchema), registerUser);
authRouter.post("/refresh", refreshAccessToken);
authRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  signinUser
);
authRouter.post(
  "/google",
  passport.authenticate("google", { session: false }),
  signinUser
);

authRouter.post("/verify", verifyMagicLink);

export default authRouter;
