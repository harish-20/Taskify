import { Router } from "express";

import { registerUser } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
// authRouter.post("/login");

export default authRouter;
