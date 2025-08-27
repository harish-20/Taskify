import { Router } from "express";
import passport from "passport";

import {
  registerUser,
  signinUser,
  verifyMagicLink,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  signinUser
);
authRouter.post("/verify", verifyMagicLink);

export default authRouter;
