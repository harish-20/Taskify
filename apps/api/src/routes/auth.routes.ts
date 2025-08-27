import { Router } from "express";
import passport from "passport";

import { registerUser, signinUser } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  signinUser
);

export default authRouter;
