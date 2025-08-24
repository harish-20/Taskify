import { Router } from "express";
import { getUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/getUser", getUser);

export default userRouter;
